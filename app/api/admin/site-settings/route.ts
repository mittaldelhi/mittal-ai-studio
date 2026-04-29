import { fail, ok, readString } from "@/lib/server/api";
import { getCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";

async function requireAdminApi() {
  const user = await getCurrentUser().catch(() => null);
  return user?.profile?.role === "admin" || user?.profile?.role === "support" ? user : null;
}

export async function POST(request: Request) {
  const user = await requireAdminApi();

  if (!user) {
    return fail("Admin access required.", 403);
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const key = readString(body?.key);
  const value = typeof body?.value === "object" && body.value !== null ? (body.value as Record<string, unknown>) : {};

  if (!key) {
    return fail("Setting key is required.", 422);
  }

  await supabaseRest("/rest/v1/site_settings", {
    method: "POST",
    service: true,
    prefer: "resolution=merge-duplicates",
    query: { on_conflict: "key" },
    body: {
      key,
      value,
      updated_at: new Date().toISOString(),
    },
  });

  return ok({ saved: true });
}
