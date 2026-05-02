import { fail, ok, readNumber, readString } from "@/lib/server/api";
import { setAuthCookies } from "@/lib/server/auth-session";
import { getSupabaseConfig } from "@/lib/server/config";

type ResetResponse = {
  error_description?: string;
  msg?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const accessToken = readString(body?.access_token);
  const refreshToken = readString(body?.refresh_token);
  const expiresIn = readNumber(body?.expires_in) || 3600;
  const password = readString(body?.password);
  const confirmPassword = readString(body?.confirm_password);
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    return fail("Supabase URL and anon key are missing.", 500);
  }

  if (!accessToken) {
    return fail("Password reset link is missing or expired. Please request a new link.", 401);
  }

  if (!password || !confirmPassword) {
    return fail("New password and confirm password are required.", 422);
  }

  if (password !== confirmPassword) {
    return fail("New password and confirm password must match.", 422);
  }

  if (password.length < 6) {
    return fail("New password must be at least 6 characters.", 422);
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
  const payload = (await response.json().catch(() => null)) as ResetResponse | null;

  if (!response.ok) {
    return fail(payload?.error_description || payload?.msg || "Password could not be reset.", 400);
  }

  await setAuthCookies(accessToken, refreshToken, expiresIn);

  return ok({ reset: true });
}
