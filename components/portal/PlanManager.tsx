"use client";

import { FormEvent, useState } from "react";

type PlanRow = {
  id?: string;
  name?: string;
  yearly?: number | null;
  note?: string | null;
  features?: string[] | null;
  active?: boolean;
  featured?: boolean;
  sort_order?: number | null;
};

function toPlanData(form: HTMLFormElement) {
  const data = Object.fromEntries(new FormData(form).entries());
  const yearly = String(data.yearly || "").trim();
  return {
    name: String(data.name || "").trim(),
    yearly: yearly ? Number(yearly) : null,
    note: String(data.note || "").trim(),
    features: String(data.features || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    active: data.active === "on",
    featured: data.featured === "on",
    sort_order: Number(data.sort_order || 0),
  };
}

export function PlanManager({ plans }: { plans: PlanRow[] }) {
  const [status, setStatus] = useState("");

  async function save(event: FormEvent<HTMLFormElement>, id?: string) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = toPlanData(form);
    setStatus("Saving plan...");

    const response = await fetch("/api/admin/records", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "plans", id, data }),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    setStatus(response.ok ? "Plan saved. Refresh to see it live on pricing." : payload?.error || "Plan save failed.");
  }

  return (
    <div className="admin-crud">
      <div className="data-card">
        <h2>Create new plan</h2>
        <form className="portal-form" onSubmit={(event) => save(event)}>
          <label>Name<input name="name" required /></label>
          <label>Yearly price<input name="yearly" type="number" /></label>
          <label>Sort order<input name="sort_order" type="number" defaultValue="10" /></label>
          <label>Plan note<textarea name="note" /></label>
          <label>Features, one per line<textarea name="features" required /></label>
          <label className="check-row"><input name="active" type="checkbox" defaultChecked /> Active</label>
          <label className="check-row"><input name="featured" type="checkbox" /> Featured</label>
          <button className="button primary" type="submit">Create Plan</button>
        </form>
      </div>
      {plans.map((plan) => (
        <div className="data-card" key={plan.id || plan.name}>
          <h2>{plan.name}</h2>
          <form className="portal-form" onSubmit={(event) => save(event, plan.id)}>
            <label>Name<input name="name" required defaultValue={plan.name || ""} /></label>
            <label>Yearly price<input name="yearly" type="number" defaultValue={plan.yearly ?? ""} /></label>
            <label>Sort order<input name="sort_order" type="number" defaultValue={plan.sort_order ?? 0} /></label>
            <label>Plan note<textarea name="note" defaultValue={plan.note || ""} /></label>
            <label>Features, one per line<textarea name="features" defaultValue={(plan.features || []).join("\n")} /></label>
            <label className="check-row"><input name="active" type="checkbox" defaultChecked={plan.active !== false} /> Active</label>
            <label className="check-row"><input name="featured" type="checkbox" defaultChecked={Boolean(plan.featured)} /> Featured</label>
            <button className="button primary" type="submit">Save Plan</button>
          </form>
        </div>
      ))}
      {status ? <p className="form-success">{status}</p> : null}
    </div>
  );
}
