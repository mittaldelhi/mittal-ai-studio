import { fail, ok, readString } from "@/lib/server/api";
import { setAuthCookies } from "@/lib/server/auth-session";
import { getSupabaseConfig } from "@/lib/server/config";
import { requireCurrentUser } from "@/lib/server/supabase-rest";

type PasswordSession = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error_description?: string;
  msg?: string;
};

export async function POST(request: Request) {
  const user = await requireCurrentUser().catch(() => null);

  if (!user) {
    return fail("Login required.", 401);
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const currentPassword = readString(body?.current_password);
  const newPassword = readString(body?.new_password);
  const confirmPassword = readString(body?.confirm_password);
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    return fail("Supabase URL and anon key are missing in .env.local.", 500);
  }

  if (!currentPassword || !newPassword || !confirmPassword) {
    return fail("Current password and new password are required.", 422);
  }

  if (newPassword !== confirmPassword) {
    return fail("New password and confirm password must match.", 422);
  }

  if (newPassword.length < 6) {
    return fail("New password must be at least 6 characters.", 422);
  }

  const loginResponse = await fetch(`${url.replace(/\/$/, "")}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: user.email, password: currentPassword }),
  });
  const session = (await loginResponse.json().catch(() => null)) as PasswordSession | null;

  if (!loginResponse.ok || !session?.access_token) {
    return fail(session?.error_description || session?.msg || "Current password is incorrect.", 401);
  }

  const updateResponse = await fetch(`${url.replace(/\/$/, "")}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: newPassword }),
  });
  const updatePayload = (await updateResponse.json().catch(() => null)) as { error_description?: string; msg?: string } | null;

  if (!updateResponse.ok) {
    return fail(updatePayload?.error_description || updatePayload?.msg || "Password could not be changed.", 400);
  }

  await setAuthCookies(session.access_token, session.refresh_token || "", session.expires_in || 3600);

  return ok({ changed: true });
}
