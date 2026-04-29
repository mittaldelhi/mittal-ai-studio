"use client";

import { FormEvent, useState } from "react";

export function SupportReplyForm({ threadId, label = "Reply" }: { threadId: string; label?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const response = await fetch("/api/support/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setStatus("error");
      setMessage(payload?.error || "Reply could not be saved.");
      return;
    }

    form.reset();
    setStatus("success");
    setMessage("Reply saved. Refresh to see latest messages.");
  }

  return (
    <form className="reply-form" onSubmit={submit}>
      <input name="thread_id" type="hidden" value={threadId} />
      <textarea name="message" required placeholder="Write a reply..." />
      <button className="button primary" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Sending..." : label}
      </button>
      {message ? <p className={status === "error" ? "form-error" : "form-success"}>{message}</p> : null}
    </form>
  );
}
