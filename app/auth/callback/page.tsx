"use client";

import { useEffect, useState } from "react";

const supabaseCallbackUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "")}/auth/v1/callback`
  : "https://YOUR-SUPABASE-PROJECT.supabase.co/auth/v1/callback";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Completing secure login...");

  useEffect(() => {
    async function finishLogin() {
      const query = new URLSearchParams(window.location.search);
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const expiresIn = params.get("expires_in");
      const code = query.get("code");
      const oauthError = query.get("error") || params.get("error");
      const oauthErrorCode = query.get("error_code") || params.get("error_code");
      const oauthErrorDescription = query.get("error_description") || params.get("error_description");

      if (oauthError || oauthErrorCode) {
        setMessage(
          `Google login setup needs one fix. Add this Authorized redirect URI in Google Cloud: ${supabaseCallbackUrl}. Error: ${
            oauthErrorDescription || oauthErrorCode || oauthError
          }`,
        );
        return;
      }

      if (!accessToken && !code) {
        setMessage(
          `Login could not be completed. Start from the Sign in page. If Google opened this page directly, set Google Cloud Authorized redirect URI to: ${supabaseCallbackUrl}`,
        );
        return;
      }

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken,
          refreshToken,
          expiresIn: expiresIn ? Number(expiresIn) : 3600,
          code,
          redirectTo: `${window.location.origin}/auth/callback`,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setMessage(payload?.error || "Session could not be created. Please check Supabase settings.");
        return;
      }

      window.location.assign(query.get("next") === "pricing" ? "/pricing" : "/dashboard");
    }

    void finishLogin();
  }, []);

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow">Google Login</span>
        <h1>{message}</h1>
      </section>
    </main>
  );
}
