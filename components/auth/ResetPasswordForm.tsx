"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

function PasswordInput({ label, name }: { label: string; name: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <label>
      {label}
      <span className="password-field">
        <input autoComplete="new-password" minLength={6} name={name} required type={visible ? "text" : "password"} />
        <button aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible((value) => !value)} type="button">
          {visible ? "Hide" : "Show"}
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
