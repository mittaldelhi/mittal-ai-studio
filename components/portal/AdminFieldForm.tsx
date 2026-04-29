"use client";

import { FormEvent, useState } from "react";

export function AdminFieldForm({
  table,
  id,
  fields,
  submitLabel = "Update",
}: {
  table: string;
  id: string;
  fields: Array<{ name: string; label: string; type?: "text" | "textarea" | "select"; options?: string[]; defaultValue?: string }>;
  submitLabel?: string;
}) {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("Saving...");

    const response = await fetch("/api/admin/records", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, id, data }),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    setStatus(response.ok ? "Saved. Refresh to see latest data." : payload?.error || "Update failed.");
  }

  return (
    <form className="inline-admin-form" onSubmit={submit}>
      {fields.map((field) => (
        <label key={field.name}>
          {field.label}
          {field.type === "textarea" ? (
            <textarea name={field.name} defaultValue={field.defaultValue || ""} />
          ) : field.type === "select" ? (
            <select name={field.name} defaultValue={field.defaultValue || field.options?.[0] || ""}>
              {(field.options || []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input name={field.name} defaultValue={field.defaultValue || ""} />
          )}
        </label>
      ))}
      <button className="button primary" type="submit">
        {submitLabel}
      </button>
      {status ? <p className="field-help">{status}</p> : null}
    </form>
  );
}
