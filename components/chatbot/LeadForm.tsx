"use client";

import { FormEvent, useState } from "react";
import { WhatsappButton } from "@/components/chatbot/WhatsappButton";

type LeadFormState = {
  name: string;
  phone: string;
  email: string;
  businessName: string;
  serviceInterest: string;
  message: string;
};

const emptyForm: LeadFormState = {
  name: "",
  phone: "",
  email: "",
  businessName: "",
  serviceInterest: "",
  message: "",
};

export function LeadForm({
  sessionId,
  visitorId,
  sourcePage,
  serviceInterest,
  onSubmitted,
}: {
  sessionId?: string;
  visitorId: string;
  sourcePage: string;
  serviceInterest?: string;
  onSubmitted: () => void;
}) {
  const [form, setForm] = useState<LeadFormState>({ ...emptyForm, serviceInterest: serviceInterest || "" });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setError("");

    const response = await fetch("/api/chatbot/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        serviceInterest: form.serviceInterest || serviceInterest,
        sessionId,
        visitorId,
        sourcePage,
      }),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok || payload?.error) {
      setStatus("error");
      setError(payload?.error || "Lead could not be saved. Please try again.");
      return;
    }

    setStatus("success");
    onSubmitted();
  }

  if (status === "success") {
    return (
      <div className="chatbot-lead-success">
        <strong>Thanks! Your details have been submitted.</strong>
        <span>Our team will contact you soon.</span>
        <WhatsappButton serviceInterest={form.serviceInterest || serviceInterest} />
      </div>
    );
  }

  return (
    <form className="chatbot-lead-form" onSubmit={submitLead}>
      <div>
        <label htmlFor="chat-name">Name</label>
        <input
          id="chat-name"
          required
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="chat-phone">Phone / WhatsApp</label>
        <input
          id="chat-phone"
          required
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
          placeholder="+91..."
        />
      </div>
      <div>
        <label htmlFor="chat-email">Email</label>
        <input
          id="chat-email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="chat-business">Business name</label>
        <input
          id="chat-business"
          value={form.businessName}
          onChange={(event) => setForm((current) => ({ ...current, businessName: event.target.value }))}
          placeholder="Business name"
        />
      </div>
      <div className="chatbot-full-field">
        <label htmlFor="chat-service">Required service</label>
        <input
          id="chat-service"
          value={form.serviceInterest}
          onChange={(event) => setForm((current) => ({ ...current, serviceInterest: event.target.value }))}
          placeholder="Website, chatbot, Google Business..."
        />
      </div>
      <div className="chatbot-full-field">
        <label htmlFor="chat-message">Message</label>
        <textarea
          id="chat-message"
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          placeholder="Tell us your requirement"
          rows={3}
        />
      </div>
      {error ? <p className="chatbot-form-error">{error}</p> : null}
      <button disabled={status === "saving"} type="submit">
        {status === "saving" ? "Submitting..." : "Submit details"}
      </button>
    </form>
  );
}
