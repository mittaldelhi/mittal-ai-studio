"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget).entries())),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setStatus("error");
      setMessage(payload?.error || "Password reset email could not be sent.");
      return;
    }

    setStatus("success");
    setMessage("Password reset link sent. Please check your email and follow the secure link.");
  }

  return (
    <form className="portal-form auth-form" onSubmit={submit}>
      <label>
        Account email
        <input autoComplete="email" name="email" required type="email" />
      </label>
      <button className="button primary" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Sending..." : "Send Reset Link"}
      </button>
      {message ? <p className={status === "error" ? "form-error" : "form-success"}>{message}</p> : null}
      <p className="auth-switch">
        Remembered your password? <Link href="/login">Sign in</Link>
      </p>
    </form>
  );
}
