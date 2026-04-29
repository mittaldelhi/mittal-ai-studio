"use client";

import { FormEvent, useState } from "react";

export function AdminRecordManager({
  table,
  rows,
}: {
  table: string;
  rows: Array<Record<string, unknown>>;
}) {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>, method: "POST" | "PATCH" | "DELETE") {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const id = String(formData.get("id") || "");
    const json = String(formData.get("json") || "{}");
    setStatus("Saving...");

    const response = await fetch("/api/admin/records", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, id, data: json ? JSON.parse(json) : {} }),
    });

    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    setStatus(response.ok ? "Saved. Refresh to see latest data." : payload?.error || "Admin action failed.");
  }

  return (
    <div className="admin-crud">
      <div className="data-card">
        <h2>Create Record</h2>
        <form className="portal-form" onSubmit={(event) => submit(event, "POST")}>
          <textarea name="json" defaultValue={"{}"} />
          <button className="button primary" type="submit">Create</button>
        </form>
      </div>
      <div className="data-card">
        <h2>Update Record</h2>
        <form className="portal-form" onSubmit={(event) => submit(event, "PATCH")}>
          <input name="id" placeholder="Record id" required />
          <textarea name="json" defaultValue={"{}"} />
          <button className="button primary" type="submit">Update</button>
        </form>
      </div>
      <div className="data-card">
        <h2>Delete Record</h2>
        <form className="portal-form" onSubmit={(event) => submit(event, "DELETE")}>
          <input name="id" placeholder="Record id" required />
          <button className="button secondary" type="submit">Delete</button>
        </form>
      </div>
      {status ? <p>{status}</p> : null}
      <div className="data-card full-span">
        <h2>{table}</h2>
        <div className="table-wrap">
          <table>
            <tbody>
              {rows.map((row) => (
                <tr key={String(row.id)}>
                  <td><code>{String(row.id || "")}</code></td>
                  <td><pre>{JSON.stringify(row, null, 2)}</pre></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
