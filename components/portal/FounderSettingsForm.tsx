"use client";

import { FormEvent, useState } from "react";

type ProfileOption = {
  id: string;
  email?: string;
  full_name?: string | null;
  role?: string;
};

type FounderSettings = {
  profile_id?: string;
  headline?: string;
  bio?: string;
  highlights?: string[];
};

export function FounderSettingsForm({
  profiles,
  settings,
}: {
  profiles: ProfileOption[];
  settings: FounderSettings;
}) {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("Saving founder settings...");

    const response = await fetch("/api/admin/site-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: "founder_profile",
        value: {
          profile_id: String(data.get("profile_id") || ""),
          headline: String(data.get("headline") || "").trim(),
          bio: String(data.get("bio") || "").trim(),
          highlights: String(data.get("highlights") || "")
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      }),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    setStatus(response.ok ? "Founder settings saved. Refresh homepage to see the update." : payload?.error || "Founder settings failed.");
  }

  return (
    <form className="portal-form" onSubmit={submit}>
      <label>
        Founder profile
        <select name="profile_id" required defaultValue={settings.profile_id || ""}>
          <option value="">Select profile</option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.full_name || profile.email} ({profile.role || "customer"})
            </option>
          ))}
        </select>
      </label>
      <label>Founder headline<textarea name="headline" defaultValue={settings.headline || ""} /></label>
      <label>Founder bio<textarea name="bio" defaultValue={settings.bio || ""} /></label>
      <label>Highlights, one per line<textarea name="highlights" defaultValue={(settings.highlights || []).join("\n")} /></label>
      <button className="button primary" type="submit">Save Founder Settings</button>
      {status ? <p className="form-success">{status}</p> : null}
    </form>
  );
}
