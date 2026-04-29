import { getSiteUrl, getSupabaseConfig } from "@/lib/server/config";

function getGoogleLoginUrl(next?: string) {
  const { url } = getSupabaseConfig();

  if (!url) {
    return "/login?error=missing_supabase";
  }

  if (!url.startsWith("https://")) {
    return "/login?error=invalid_supabase_url";
  }

  const loginUrl = new URL(`${url.replace(/\/$/, "")}/auth/v1/authorize`);
  loginUrl.searchParams.set("provider", "google");
  const callbackUrl = new URL(`${getSiteUrl()}/auth/callback`);
  if (next) {
    callbackUrl.searchParams.set("next", next);
  }
  loginUrl.searchParams.set("redirect_to", callbackUrl.toString());

  return loginUrl.toString();
}

export function LoginButton({ next }: { next?: string } = {}) {
  return (
    <a className="google-auth-button" href={getGoogleLoginUrl(next)}>
      <span aria-hidden="true" className="gmail-wordmark">
        <span className="gmail-blue">G</span>
        <span className="gmail-red">o</span>
        <span className="gmail-yellow">o</span>
        <span className="gmail-blue">g</span>
        <span className="gmail-green">l</span>
        <span className="gmail-red">e</span>
      </span>
    </a>
  );
}
