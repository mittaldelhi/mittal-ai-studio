import { fail, ok, readString } from "@/lib/server/api";
import { requireCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";
import type { SupportThread } from "@/lib/types/platform";

export async function POST(request: Request) {
  const user = await requireCurrentUser().catch(() => null);

  if (!user) {
    return fail("Login required.", 401);
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const subject = readString(body?.subject);
  const message = readString(body?.message);
  const threadId = readString(body?.thread_id);
  const isAdmin = user.profile?.role === "admin" || user.profile?.role === "support";

  if (!message) {
    return fail("Message is required.", 422);
  }

  let thread: SupportThread | null = null;

  if (threadId) {
    thread =
      (
        await supabaseRest<SupportThread[]>("/rest/v1/support_threads", {
          service: true,
          query: { id: `eq.${threadId}`, select: "*" },
        })
      )[0] || null;

    if (!thread || (!isAdmin && thread.user_id !== user.id)) {
      return fail("Support thread not found.", 404);
    }
  } else {
    if (!subject) {
      return fail("Subject is required for a new support thread.", 422);
    }

    thread = (
      await supabaseRest<SupportThread[]>("/rest/v1/support_threads", {
        method: "POST",
        service: true,
        prefer: "return=representation",
        body: { user_id: user.id, subject, status: "open" },
      })
    )[0];
  }

  await supabaseRest("/rest/v1/support_messages", {
    method: "POST",
    service: true,
    body: {
      thread_id: thread.id,
      user_id: user.id,
      sender_role: isAdmin ? user.profile?.role || "admin" : "customer",
      message,
    },
  });

  return ok({ threadId: thread.id });
}
