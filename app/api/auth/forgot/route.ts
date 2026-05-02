import { fail, ok, readString } from "@/lib/server/api";
import { getSiteUrl, getSupabaseConfig } from "@/lib/server/config";

type RecoverResponse = {
  error_description?: string;
  msg?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const email = readString(body?.email).toLowerCase();
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    return fail("Supabase URL and anon key are missing.", 500);
  }

  if (!email) {
    return fail("Email is required.", 422);
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/recover`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      redirect_to: `${getSiteUrl()}/reset-password`,
    }),
  });
  const payload = (await response.json().catch(() => null)) as RecoverResponse | null;

  if (!response.ok) {
    return fail(payload?.error_description || payload?.msg || "Password reset email could not be sent.", 400);
  }

  return ok({ sent: true });
}
