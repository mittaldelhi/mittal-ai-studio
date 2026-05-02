"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

function createChallenge() {
  const left = Math.floor(Math.random() * 8) + 2;
  const right = Math.floor(Math.random() * 7) + 3;

  return {
    label: `${left} + ${right}`,
    answer: String(left + right),
  };
}

function PasswordInput({
  autoComplete,
  label,
  name,
}: {
  autoComplete: string;
  label: string;
  name: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label>
      {label}
      <span className="password-field">
        <input
          autoComplete={autoComplete}
          minLength={6}
          name={name}
          placeholder={label}
          required
          type={visible ? "text" : "password"}
        />
        <button aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible((value) => !value)} type="button">
          {visible ? (
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 4.24A10.65 10.65 0 0112 4c6 0 9.5 6 9.5 8a8.4 8.4 0 01-2.17 3.64M6.61 6.61C3.98 8.36 2.5 11.05 2.5 12c0 2 3.5 8 9.5 8 1.76 0 3.3-.52 4.6-1.3" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M2.5 12S6 4 12 4s9.5 8 9.5 8-3.5 8-9.5 8-9.5-8-9.5-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </span>
    </label>
  );
}

export function PasswordAuthForm({ mode }: { mode: "signin" | "signup" }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [challenge, setChallenge] = useState(() => createChallenge());
  const isSignup = mode === "signup";
  const needsChallenge = !isSignup && failedAttempts >= 3;
  const passwordHelp = useMemo(
    () => (isSignup ? "Use at least 6 characters. A longer password with letters, numbers, and symbols is better." : ""),
    [isSignup],
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());

    if (isSignup && values.password !== values.confirm_password) {
      setStatus("error");
      setMessage("Password and confirm password must match.");
      return;
    }

    if (needsChallenge && String(values.security_answer || "").trim() !== challenge.answer) {
      setStatus("error");
      setMessage("Security check answer is incorrect. Please try again.");
      setChallenge(createChallenge());
      return;
    }

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string; data?: { needsConfirmation?: boolean } } | null;

    if (!response.ok) {
      if (!isSignup) {
        setFailedAttempts((count) => count + 1);
        setChallenge(createChallenge());
      }
      setStatus("error");
      setMessage(payload?.error || "Authentication failed.");
      return;
    }

    if (payload?.data?.needsConfirmation) {
      setStatus("success");
      setMessage("Account created. Please verify your email, then sign in.");
      return;
    }

    setFailedAttempts(0);
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
        <input autoComplete="email" name="email" placeholder="you@business.com" required type="email" />
      </label>
      <PasswordInput autoComplete={isSignup ? "new-password" : "current-password"} label="Password" name="password" />
      {passwordHelp ? <p className="field-help">{passwordHelp}</p> : null}
      {isSignup ? <PasswordInput autoComplete="new-password" label="Retype password" name="confirm_password" /> : null}
      {needsChallenge ? (
        <label className="security-challenge">
          Security check
          <span>Solve this to continue: {challenge.label}</span>
          <input inputMode="numeric" name="security_answer" required />
        </label>
      ) : null}
      <button className="button primary" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
      </button>
      {message ? <p className={status === "error" ? "form-error" : "form-success"}>{message}</p> : null}
      {!isSignup ? (
        <Link className="auth-forgot-link" href="/forgot-password">
          Forgot password?
        </Link>
      ) : null}
      <p className="auth-switch">
        {isSignup ? "Already have an account?" : "New to Mittal AI Studio?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Create account"}</Link>
      </p>
    </form>
  );
}
