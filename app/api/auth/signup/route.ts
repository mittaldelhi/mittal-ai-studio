import { fail, ok, readNumber, readString } from "@/lib/server/api";
import { setAuthCookies } from "@/lib/server/auth-session";
import { getSupabaseConfig } from "@/lib/server/config";
import { getSupabaseUser, upsertProfile } from "@/lib/server/supabase-rest";

type SignupResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
      avatar_url?: string;
    };
  };
  error_description?: string;
  msg?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const fullName = readString(body?.full_name);
  const email = readString(body?.email).toLowerCase();
  const password = readString(body?.password);
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    return fail("Supabase URL and anon key are missing in .env.local.", 500);
  }

  if (!fullName || !email || !password) {
    return fail("Full name, email, and password are required.", 422);
  }

  if (password.length < 6) {
    return fail("Password must be at least 6 characters.", 422);
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      data: {
        full_name: fullName,
        name: fullName,
      },
    }),
  });
  const session = (await response.json().catch(() => null)) as SignupResponse | null;

  if (!response.ok) {
    return fail(session?.error_description || session?.msg || "Could not create account.", 400);
  }

  if (!session?.access_token) {
    return ok({ needsConfirmation: true });
  }

  const user = await getSupabaseUser(session.access_token);

  if (!user?.email) {
    return fail("Account created but session could not be started.", 401);
  }

  await upsertProfile(user);
  await setAuthCookies(session.access_token, session.refresh_token || "", readNumber(session.expires_in) || 3600);

  return ok({ userId: user.id, email: user.email });
}
