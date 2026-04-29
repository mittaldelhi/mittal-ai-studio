import { fail, ok, readNumber, readString } from "@/lib/server/api";
import { setAuthCookies } from "@/lib/server/auth-session";
import { getSupabaseConfig } from "@/lib/server/config";
import { getSupabaseUser, upsertProfile } from "@/lib/server/supabase-rest";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  let accessToken = readString(body?.accessToken);
  let refreshToken = readString(body?.refreshToken);
  const expiresIn = readNumber(body?.expiresIn) || 3600;
  const code = readString(body?.code);
  const redirectTo = readString(body?.redirectTo);

  if (!accessToken && code) {
    const { url, anonKey } = getSupabaseConfig();

    if (!url || !anonKey) {
      return fail("Supabase URL and anon key are missing in .env.local.", 500);
    }

    const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/token?grant_type=pkce`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ auth_code: code, redirect_to: redirectTo }),
    });
    const session = (await response.json().catch(() => null)) as
      | { access_token?: string; refresh_token?: string; expires_in?: number }
      | null;

    if (!response.ok || !session?.access_token) {
      return fail("Could not exchange Google login code for a Supabase session.", 401);
    }

    accessToken = session.access_token;
    refreshToken = session.refresh_token || "";
  }

  if (!accessToken) {
    return fail("Missing access token.", 422);
  }

  let user;

  try {
    user = await getSupabaseUser(accessToken);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Supabase user lookup error.";
    return fail(`Supabase user lookup failed: ${message}`, 401);
  }

  if (!user?.email) {
    return fail("Invalid Supabase session.", 401);
  }

  try {
    await upsertProfile(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Supabase profile error.";
    return fail(`Supabase profile creation failed: ${message}`, 500);
  }

  await setAuthCookies(accessToken, refreshToken, expiresIn);

  return ok({ userId: user.id, email: user.email });
}
