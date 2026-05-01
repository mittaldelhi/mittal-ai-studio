import { getChatbotResponse } from "@/lib/chatbot/chatbotEngine";
import { getOptionalAiReply } from "@/lib/chatbot/optionalAiResponse";
import type { ChatIntent } from "@/lib/chatbot/types";
import { fail, ok, readString } from "@/lib/server/api";
import { supabaseRest } from "@/lib/server/supabase-rest";

type ChatSessionRow = {
  id: string;
};

const messageBuckets = new Map<string, { count: number; resetAt: number }>();
const MESSAGE_LIMIT = 35;
const MESSAGE_WINDOW_MS = 60_000;

function sanitizeMessage(value: string) {
  return value.replace(/[<>]/g, "").slice(0, 1200).trim();
}

function isRateLimited(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const bucket = messageBuckets.get(ip);

  if (!bucket || bucket.resetAt < now) {
    messageBuckets.set(ip, { count: 1, resetAt: now + MESSAGE_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > MESSAGE_LIMIT;
}

async function createSession(visitorId: string, sourcePage: string, userAgent: string) {
  const rows = await supabaseRest<ChatSessionRow[]>("/rest/v1/chat_sessions", {
    method: "POST",
    service: true,
    prefer: "return=representation",
    body: {
      visitor_id: visitorId,
      source_page: sourcePage || null,
      user_agent: userAgent || null,
      status: "active",
    },
  });

  return rows[0]?.id || "";
}

async function saveMessage(sessionId: string, senderType: "user" | "bot", message: string) {
  if (!sessionId || !message) {
    return;
  }

  await supabaseRest("/rest/v1/chat_messages", {
    method: "POST",
    service: true,
    body: {
      session_id: sessionId,
      sender_type: senderType,
      message,
    },
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const message = sanitizeMessage(readString(body?.message));
  const visitorId = readString(body?.visitorId) || crypto.randomUUID();
  const sourcePage = readString(body?.sourcePage);
  const contextIntent = readString(body?.contextIntent) as ChatIntent;
  let sessionId = readString(body?.sessionId);

  if (!message) {
    return fail("Message is required.", 422);
  }

  if (isRateLimited(request)) {
    return fail("Too many chat messages. Please wait a minute and try again.", 429);
  }

  const response = getChatbotResponse(message, contextIntent);
  const aiReply = await getOptionalAiReply(message, response.intent);
  const finalResponse = aiReply ? { ...response, reply: aiReply } : response;
  const userAgent = request.headers.get("user-agent") || "";

  try {
    if (!sessionId) {
      sessionId = await createSession(visitorId, sourcePage, userAgent);
    }

    await saveMessage(sessionId, "user", message);
    await saveMessage(sessionId, "bot", finalResponse.reply);
  } catch (error) {
    console.error("Chatbot message storage failed", error);
  }

  return ok({
    sessionId,
    visitorId,
    ...finalResponse,
  });
}
