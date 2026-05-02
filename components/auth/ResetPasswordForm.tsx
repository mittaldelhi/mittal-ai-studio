"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

function PasswordInput({ label, name }: { label: string; name: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <label>
      {label}
      <span className="password-field">
        <input autoComplete="new-password" minLength={6} name={name} placeholder={label} required type={visible ? "text" : "password"} />
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

export function ResetPasswordForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [tokens] = useState(() => {
    if (typeof window === "undefined") {
      return {
        accessToken: "",
        refreshToken: "",
        expiresIn: "3600",
      };
    }

    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

    return {
      accessToken: hash.get("access_token") || "",
      refreshToken: hash.get("refresh_token") || "",
      expiresIn: hash.get("expires_in") || "3600",
    };
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formValues = Object.fromEntries(new FormData(event.currentTarget).entries());

    if (formValues.password !== formValues.confirm_password) {
      setStatus("error");
      setMessage("New password and confirm password must match.");
      return;
    }

    const response = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formValues,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expires_in: tokens.expiresIn,
      }),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setStatus("error");
      setMessage(payload?.error || "Password could not be reset.");
      return;
    }

    setStatus("success");
    setMessage("Password updated successfully. Redirecting to your dashboard...");
    window.setTimeout(() => window.location.assign("/dashboard"), 900);
  }

  if (!tokens.accessToken) {
    return (
      <div className="portal-form auth-form">
        <p className="form-error">This reset link is missing or expired. Please request a new password reset link.</p>
        <Link className="button primary" href="/forgot-password">
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <form className="portal-form auth-form" onSubmit={submit}>
      <PasswordInput label="New password" name="password" />
      <PasswordInput label="Retype new password" name="confirm_password" />
      <p className="field-help">Use at least 6 characters. A longer password with letters, numbers, and symbols is better.</p>
      <button className="button primary" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Updating..." : "Update Password"}
      </button>
      {message ? <p className={status === "error" ? "form-error" : "form-success"}>{message}</p> : null}
    </form>
  );
}
