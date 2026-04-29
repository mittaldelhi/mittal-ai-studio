import { fail, ok, readString } from "@/lib/server/api";
import { requireCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";

export async function POST(request: Request) {
  const user = await requireCurrentUser().catch(() => null);

  if (!user) {
    return fail("Login required.", 401);
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const title = readString(body?.title);
  const description = readString(body?.description);

  if (!title || !description) {
    return fail("Title and description are required.", 422);
  }

  const rows = await supabaseRest<Array<{ id: string }>>("/rest/v1/complaints", {
    method: "POST",
    service: true,
    prefer: "return=representation",
    body: { user_id: user.id, title, description, status: "open" },
  });

  return ok({ complaintId: rows[0]?.id });
}
