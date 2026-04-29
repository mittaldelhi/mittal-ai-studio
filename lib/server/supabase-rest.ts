import { cookies } from "next/headers";
import { getSupabaseConfig, requireSupabaseConfig } from "@/lib/server/config";
import type { Profile } from "@/lib/types/platform";

type Query = Record<string, string | number | boolean | null | undefined>;

type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
};

type SupabaseOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Query;
  token?: string;
  service?: boolean;
  prefer?: string;
};

const SUPABASE_TIMEOUT_MS = 6000;

function timeoutSignal() {
  return AbortSignal.timeout(SUPABASE_TIMEOUT_MS);
}

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  profile: Profile | null;
};

function buildUrl(path: string, query?: Query) {
  const { url } = requireSupabaseConfig();
  const endpoint = new URL(`${url.replace(/\/$/, "")}${path}`);

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      endpoint.searchParams.set(key, String(value));
    }
  });

  return endpoint.toString();
}

function getAuthHeaders(options: SupabaseOptions) {
  const { anonKey, serviceRoleKey } = requireSupabaseConfig();
  const key = options.service && serviceRoleKey ? serviceRoleKey : anonKey;

  return {
    apikey: key,
    Authorization: `Bearer ${options.token || key}`,
    "Content-Type": "application/json",
    ...(options.prefer ? { Prefer: options.prefer } : {}),
  };
}

export async function supabaseRest<T>(path: string, options: SupabaseOptions = {}): Promise<T> {
  const response = await fetch(buildUrl(path, options.query), {
    method: options.method || "GET",
    headers: getAuthHeaders(options),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
    signal: timeoutSignal(),
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T) : (null as T);

  if (!response.ok) {
    throw new Error(typeof data === "object" && data && "message" in data ? String(data.message) : "Supabase request failed.");
  }

  return data;
}

export function getAccessTokenFromRequest(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  return (
    cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("sb-access-token="))
      ?.split("=")[1] || ""
  );
}

export async function getAccessTokenFromCookies() {
  return (await cookies()).get("sb-access-token")?.value || "";
}

export async function getSupabaseUser(token: string) {
  const { url, anonKey } = requireSupabaseConfig();

  if (!token) {
    return null;
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    signal: timeoutSignal(),
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  return (await response.json()) as SupabaseUser;
}

export async function upsertProfile(user: SupabaseUser) {
  if (!user.email) {
    return null;
  }

  const existing = await getProfile(user.id).catch(() => null);
  const metadataName = user.user_metadata?.full_name || user.user_metadata?.name || null;
  const metadataAvatar = user.user_metadata?.avatar_url || null;

  if (existing) {
    const rows = await supabaseRest<Profile[]>("/rest/v1/profiles", {
      method: "PATCH",
      service: true,
      prefer: "return=representation",
      body: {
        email: user.email,
        full_name: existing.full_name || metadataName,
        avatar_url: existing.avatar_url || metadataAvatar,
      },
      query: { id: `eq.${user.id}` },
    });

    await supabaseRest("/rest/v1/business_profiles", {
      method: "POST",
      service: true,
      prefer: "resolution=ignore-duplicates",
      body: {
        user_id: user.id,
      },
      query: { on_conflict: "user_id" },
    });

    return rows[0] || existing;
  }

  const rows = await supabaseRest<Profile[]>("/rest/v1/profiles", {
    method: "POST",
    service: true,
    prefer: "resolution=merge-duplicates,return=representation",
    body: {
      id: user.id,
      email: user.email,
      full_name: metadataName,
      avatar_url: metadataAvatar,
      role: "customer",
    },
    query: { on_conflict: "id" },
  });

  await supabaseRest("/rest/v1/business_profiles", {
    method: "POST",
    service: true,
    prefer: "resolution=ignore-duplicates",
    body: {
      user_id: user.id,
    },
    query: { on_conflict: "user_id" },
  });

  return rows[0] || null;
}

export async function getProfile(userId: string) {
  const rows = await supabaseRest<Profile[]>("/rest/v1/profiles", {
    service: true,
    query: { id: `eq.${userId}`, select: "*" },
  });

  return rows[0] || null;
}

export async function getCurrentUser() {
  const token = await getAccessTokenFromCookies();
  const user = await getSupabaseUser(token);

  if (!user?.email) {
    return null;
  }

  const profile = (await getProfile(user.id)) || (await upsertProfile(user));

  return {
    id: user.id,
    email: user.email,
    name: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email,
    accessToken: token,
    profile,
  } satisfies SessionUser;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  return user;
}

export async function isAdminUser(userId: string) {
  const profile = await getProfile(userId);
  return profile?.role === "admin" || profile?.role === "support";
}

export function isSupabaseConfigured() {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}
