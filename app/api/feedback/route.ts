import { fail, ok, readNumber, readString } from "@/lib/server/api";
import { getCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";

export async function POST(request: Request) {
  const user = await getCurrentUser().catch(() => null);
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const rating = readNumber(body?.rating);
  const message = readString(body?.message);

  if (rating < 1 || rating > 5 || !message) {
    return fail("Rating from 1 to 5 and message are required.", 422);
  }

  const rows = await supabaseRest<Array<{ id: string }>>("/rest/v1/feedback", {
    method: "POST",
    service: true,
    prefer: "return=representation",
    body: { user_id: user?.id || null, rating, message },
  });

  return ok({ feedbackId: rows[0]?.id });
}
