import { fail, ok, readString } from "@/lib/server/api";
import { requireCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";

export async function POST(request: Request) {
  const user = await requireCurrentUser().catch(() => null);

  if (!user) {
    return fail("Login required.", 401);
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const serviceName = readString(body?.service_name);
  const message = readString(body?.message);

  if (!serviceName || !message) {
    return fail("Service name and message are required.", 422);
  }

  const rows = await supabaseRest<Array<{ id: string }>>("/rest/v1/reviews", {
    method: "POST",
    service: true,
    prefer: "return=representation",
    body: { user_id: user.id, service_name: serviceName, message, status: "requested" },
  });

  return ok({ reviewId: rows[0]?.id });
}
