"use client";

import { FormEvent, useState } from "react";

export function SmartForm({
  endpoint,
  children,
  submitLabel,
}: {
  endpoint: string;
  children: React.ReactNode;
  submitLabel: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setMessage("");

    const body = Object.fromEntries(new FormData(form).entries());
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setStatus("error");
      setMessage(payload?.error || "Something went wrong.");
      return;
    }

    form.reset();
    setStatus("success");
    setMessage("Saved successfully.");
  }

  return (
    <form className="portal-form" onSubmit={submit}>
      {children}
      <button className="button primary" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Saving..." : submitLabel}
      </button>
      {message ? <p className={status === "error" ? "form-error" : "form-success"}>{message}</p> : null}
    </form>
  );
}
