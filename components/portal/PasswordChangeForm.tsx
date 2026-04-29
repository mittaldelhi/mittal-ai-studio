"use client";

import { FormEvent, useState } from "react";

export function PasswordChangeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("loading");
    setMessage("");

    if (data.new_password !== data.confirm_password) {
      setStatus("error");
      setMessage("New password and confirm password must match.");
      return;
    }

    const response = await fetch("/api/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setStatus("error");
      setMessage(payload?.error || "Password could not be changed.");
      return;
    }

    form.reset();
    setStatus("success");
    setMessage("Password changed successfully.");
  }

  return (
    <form className="portal-form" onSubmit={submit}>
      <label>
        Current password
        <input autoComplete="current-password" name="current_password" required type="password" />
      </label>
      <label>
        New password
        <input autoComplete="new-password" minLength={6} name="new_password" required type="password" />
      </label>
      <label>
        Confirm new password
        <input autoComplete="new-password" minLength={6} name="confirm_password" required type="password" />
      </label>
      <button className="button primary" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Changing..." : "Change Password"}
      </button>
      {message ? <p className={status === "error" ? "form-error" : "form-success"}>{message}</p> : null}
    </form>
  );
}
