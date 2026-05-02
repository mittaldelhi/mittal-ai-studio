export const PRODUCTION_SITE_URL = "https://mittalaistudio.com";

export function getSiteUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  return "http://127.0.0.1:3000";
}

export function getAuthCallbackUrl(next?: string) {
  const callbackUrl = new URL(`${getSiteUrl()}/auth/callback`);

  if (next) {
    callbackUrl.searchParams.set("next", next);
  }

  return callbackUrl.toString();
}

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  };
}

export function requireSupabaseConfig() {
  const config = getSupabaseConfig();

  if (!config.url || !config.anonKey) {
    throw new Error("Supabase URL and anon key are required.");
  }

  return config;
}
