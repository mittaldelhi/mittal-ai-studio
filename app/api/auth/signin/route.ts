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

const failedLoginAttempts = new Map<string, { count: number; expiresAt: number }>();
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_SERVER_ATTEMPTS = 8;

function getAttemptKey(request: Request, email: string) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || request.headers.get("x-real-ip") || "unknown";

  return `${ip}:${email}`;
}

function getAttemptRecord(key: string) {
  const record = failedLoginAttempts.get(key);

  if (!record || record.expiresAt < Date.now()) {
    failedLoginAttempts.delete(key);
    return null;
  }

  return record;
}

function recordFailedAttempt(key: string) {
  const current = getAttemptRecord(key);

  failedLoginAttempts.set(key, {
    count: (current?.count || 0) + 1,
    expiresAt: Date.now() + ATTEMPT_WINDOW_MS,
  });
}

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

  const attemptKey = getAttemptKey(request, email);
  const attemptRecord = getAttemptRecord(attemptKey);

  if (attemptRecord && attemptRecord.count >= MAX_SERVER_ATTEMPTS) {
    return fail("Too many failed login attempts. Please wait 15 minutes or reset your password.", 429);
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
    recordFailedAttempt(attemptKey);
    return fail(session?.error_description || session?.msg || "Invalid email or password.", 401);
  }

  const user = await getSupabaseUser(session.access_token);

  if (!user?.email) {
    return fail("Invalid Supabase session.", 401);
  }

  await upsertProfile(user);
  await setAuthCookies(session.access_token, session.refresh_token || "", readNumber(session.expires_in) || 3600);
  failedLoginAttempts.delete(attemptKey);

  return ok({ userId: user.id, email: user.email });
}
