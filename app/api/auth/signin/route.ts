import { fail, ok, readNumber, readString } from "@/lib/server/api";
import { setAuthCookies } from "@/lib/server/auth-session";
import { getSupabaseConfig } from "@/lib/server/config";
import { getSupabaseUser, upsertProfile } from "@/lib/server/supabase-rest";

type PasswordSession = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error_description?: string;
  msg?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const email = readString(body?.email).toLowerCase();
  const password = readString(body?.password);
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    return fail("Supabase URL and anon key are missing in .env.local.", 500);
  }

  if (!email || !password) {
    return fail("Email and password are required.", 422);
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const session = (await response.json().catch(() => null)) as PasswordSession | null;

  if (!response.ok || !session?.access_token) {
    return fail(session?.error_description || session?.msg || "Invalid email or password.", 401);
  }

  const user = await getSupabaseUser(session.access_token);

  if (!user?.email) {
    return fail("Invalid Supabase session.", 401);
  }

  await upsertProfile(user);
  await setAuthCookies(session.access_token, session.refresh_token || "", readNumber(session.expires_in) || 3600);

  return ok({ userId: user.id, email: user.email });
}
