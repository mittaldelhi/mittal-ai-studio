import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginButton } from "@/components/auth/LoginButton";
import { PasswordAuthForm } from "@/components/auth/PasswordAuthForm";
import { getSupabaseConfig } from "@/lib/server/config";

const errors: Record<string, string> = {
  missing_supabase: "Supabase URL is missing in .env.local.",
  invalid_supabase_url: "NEXT_PUBLIC_SUPABASE_URL must be your Supabase Project URL, not the Google client id.",
  bad_oauth_callback:
    "Google OAuth is returning directly to this website. In Google Cloud, the authorized redirect URI must be your Supabase callback URL.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const errorMessage = error ? errors[error] : "";
  const { url } = getSupabaseConfig();
  const supabaseCallbackUrl = url ? `${url.replace(/\/$/, "")}/auth/v1/callback` : "https://YOUR-SUPABASE-PROJECT.supabase.co/auth/v1/callback";

  return (
    <AuthShell
      eyebrow="Secure Login"
      title="Welcome back"
      description="Log in to manage your business profile, payments, project support, and AI growth tools."
    >
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <PasswordAuthForm mode="signin" />
        <div className="auth-divider">
          <span>or</span>
        </div>
        <LoginButton next={next} />
        {error ? <div className="data-card">
          <h2>Required Google OAuth setup</h2>
          <p>Google Cloud redirect URI must be:</p>
          <code>{supabaseCallbackUrl}</code>
          <p>Supabase Auth redirect URL must be:</p>
          <code>http://127.0.0.1:3000/auth/callback</code>
        </div> : null}
        <Link className="button secondary" href="/">
          Back to website
        </Link>
    </AuthShell>
  );
}
