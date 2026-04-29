"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function PasswordAuthForm({ mode }: { mode: "signin" | "signup" }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const isSignup = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget).entries())),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string; data?: { needsConfirmation?: boolean } } | null;

    if (!response.ok) {
      setStatus("error");
      setMessage(payload?.error || "Authentication failed.");
      return;
    }

    if (payload?.data?.needsConfirmation) {
      setStatus("success");
      setMessage("Account created. Please verify your email, then sign in.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    window.location.assign(params.get("next") === "pricing" ? "/pricing" : "/dashboard");
  }

  return (
    <form className="portal-form auth-form" onSubmit={submit}>
      {isSignup ? (
        <label>
          Full name
          <input autoComplete="name" name="full_name" required />
        </label>
      ) : null}
      <label>
        Email
        <input autoComplete="email" name="email" required type="email" />
      </label>
      <label>
        Password
        <input autoComplete={isSignup ? "new-password" : "current-password"} minLength={6} name="password" required type="password" />
      </label>
      <button className="button primary" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
      </button>
      {message ? <p className={status === "error" ? "form-error" : "form-success"}>{message}</p> : null}
      <p className="auth-switch">
        {isSignup ? "Already have an account?" : "New to Mittal AI Studio?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Create account"}</Link>
      </p>
    </form>
  );
}
