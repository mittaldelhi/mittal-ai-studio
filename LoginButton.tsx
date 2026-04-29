import { getSiteUrl, getSupabaseConfig } from "@/lib/server/config";

function getGoogleLoginUrl() {
  const { url } = getSupabaseConfig();

  if (!url) {
    return "/login?error=missing_supabase";
  }

  if (!url.startsWith("https://")) {
    return "/login?error=invalid_supabase_url";
  }

  const loginUrl = new URL(`${url.replace(/\/$/, "")}/auth/v1/authorize`);
  loginUrl.searchParams.set("provider", "google");
  loginUrl.searchParams.set("redirect_to", `${getSiteUrl()}/auth/callback`);
  loginUrl.searchParams.set("response_type", "token");

  return loginUrl.toString();
}

export function LoginButton() {
  return (
    <a className="google-auth-button" href={getGoogleLoginUrl()}>
      <span aria-hidden="true" className="gmail-wordmark">
        <span className="gmail-blue">G</span>
        <span className="gmail-red">m</span>
        <span className="gmail-yellow">a</span>
        <span className="gmail-blue">i</span>
        <span className="gmail-green">l</span>
      </span>
      <span>Sign in with Google</span>
    </a>
  );
}
