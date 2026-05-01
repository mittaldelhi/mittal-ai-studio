import { fail, ok, readString } from "@/lib/server/api";
import { supabaseRest } from "@/lib/server/supabase-rest";
import type { ChatLeadFormInput } from "@/lib/chatbot/types";

type ChatSessionRow = {
  id: string;
};

type ChatLeadRow = {
  id: string;
};

const leadBuckets = new Map<string, { count: number; resetAt: number }>();
const LEAD_LIMIT = 5;
const LEAD_WINDOW_MS = 10 * 60_000;

function clean(value: unknown, max = 300) {
  return readString(value).replace(/[<>]/g, "").slice(0, max);
}

function isRateLimited(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const bucket = leadBuckets.get(ip);

  if (!bucket || bucket.resetAt < now) {
    leadBuckets.set(ip, { count: 1, resetAt: now + LEAD_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > LEAD_LIMIT;
}

function isValidEmail(email: string) {
  return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  return /^[0-9+\-\s()]{7,20}$/.test(phone);
}

async function ensureSession(input: ChatLeadFormInput, request: Request) {
  if (input.sessionId) {
    return input.sessionId;
  }

  const rows = await supabaseRest<ChatSessionRow[]>("/rest/v1/chat_sessions", {
    method: "POST",
    service: true,
    prefer: "return=representation",
    body: {
      visitor_id: input.visitorId || crypto.randomUUID(),
      source_page: input.sourcePage || null,
      user_agent: request.headers.get("user-agent") || null,
      status: "active",
    },
  });

  return rows[0]?.id || null;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const input: ChatLeadFormInput = {
    sessionId: clean(body?.sessionId, 80),
    visitorId: clean(body?.visitorId, 80),
    name: clean(body?.name, 120),
    phone: clean(body?.phone, 30),
    email: clean(body?.email, 160),
    businessName: clean(body?.businessName, 160),
    serviceInterest: clean(body?.serviceInterest, 160),
    budgetRange: clean(body?.budgetRange, 80),
    timeline: clean(body?.timeline, 80),
    city: clean(body?.city, 120),
    message: clean(body?.message, 1000),
    sourcePage: clean(body?.sourcePage, 300),
  };

  if (!input.name || !input.phone) {
    return fail("Name and phone number are required.", 422);
  }

  if (isRateLimited(request)) {
    return fail("Too many lead submissions. Please try again later or use WhatsApp.", 429);
  }

  if (!isValidPhone(input.phone)) {
    return fail("Please enter a valid phone or WhatsApp number.", 422);
  }

  if (input.email && !isValidEmail(input.email)) {
    return fail("Please enter a valid email address.", 422);
  }

  try {
    const sessionId = await ensureSession(input, request);
    const rows = await supabaseRest<ChatLeadRow[]>("/rest/v1/chat_leads", {
      method: "POST",
      service: true,
      prefer: "return=representation",
      body: {
        session_id: sessionId,
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        business_name: input.businessName || null,
        service_interest: input.serviceInterest || "General Requirement",
        budget_range: input.budgetRange || null,
        timeline: input.timeline || null,
        city: input.city || null,
        message: input.message || null,
        status: "new",
        source: "Chatbot",
      },
    });

    if (sessionId) {
      await supabaseRest("/rest/v1/chat_messages", {
        method: "POST",
        service: true,
        body: {
          session_id: sessionId,
          sender_type: "bot",
          message: "Lead details submitted from chatbot form.",
        },
      }).catch(() => null);
    }

    return ok({ leadId: rows[0]?.id || null, sessionId });
  } catch (error) {
    console.error("Chatbot lead storage failed", error);
    return fail("Lead could not be saved. Please try WhatsApp support.", 500);
  }
}
