"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import type { BusinessProfile, Profile } from "@/lib/types/platform";

export function ProfileForm({
  email,
  profile,
  business,
}: {
  email: string;
  profile: Profile | null;
  business: BusinessProfile | null;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(profile?.avatar_url || "");
  const [photoMessage, setPhotoMessage] = useState("");
  const [previewObjectUrl, setPreviewObjectUrl] = useState("");

  useEffect(() => {
    return () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
      }
    };
  }, [previewObjectUrl]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/profile", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setStatus("error");
      setMessage(payload?.error || "Something went wrong.");
      return;
    }

    setStatus("success");
    setMessage("Profile saved successfully.");
  }

  return (
    <form className="portal-form profile-form" onSubmit={submit}>
      <div className="profile-photo-row">
        <div className="profile-avatar">
          {preview ? (
            <Image src={preview} alt="" width={92} height={92} unoptimized={preview.startsWith("blob:")} />
          ) : (
            <span>{(profile?.full_name || email).slice(0, 1).toUpperCase()}</span>
          )}
        </div>
        <label>
          Profile photo
          <input
            accept="image/*"
            name="avatar"
            type="file"
            onChange={(event) => {
              const input = event.currentTarget;
              const file = input.files?.[0];
              setPhotoMessage("");

              if (previewObjectUrl) {
                URL.revokeObjectURL(previewObjectUrl);
                setPreviewObjectUrl("");
              }

              if (!file) {
                setPreview(profile?.avatar_url || "");
                return;
              }

              if (!file.type.startsWith("image/")) {
                input.value = "";
                setPreview(profile?.avatar_url || "");
                setPhotoMessage("Profile photo must be an image.");
                return;
              }

              const objectUrl = URL.createObjectURL(file);
              setPreviewObjectUrl(objectUrl);
              setPreview(objectUrl);
              setPhotoMessage(`Selected original photo: ${(file.size / 1024 / 1024).toFixed(1)} MB. It will upload without compression.`);
            }}
          />
          {photoMessage ? <span className="field-help">{photoMessage}</span> : null}
        </label>
      </div>
      <input name="avatar_url" type="hidden" value={profile?.avatar_url || ""} />
      <div className="form-grid">
        <label>
          Full name
          <input name="full_name" defaultValue={profile?.full_name || ""} />
        </label>
        <label>
          Email
          <input name="email" defaultValue={email} disabled />
        </label>
        <label>
          Phone
          <input name="phone" defaultValue={profile?.phone || ""} />
        </label>
        <label>
          WhatsApp
          <input name="whatsapp" defaultValue={profile?.whatsapp || ""} />
        </label>
        <label>
          Business name
          <input name="business_name" defaultValue={business?.business_name || ""} />
        </label>
        <label>
          Business type
          <input name="business_type" defaultValue={business?.business_type || ""} />
        </label>
        <label>
          City
          <input name="city" defaultValue={business?.city || ""} />
        </label>
        <label>
          Service interest
          <input name="service_interest" defaultValue={business?.service_interest || ""} />
        </label>
        <label className="full-span">
          Address
          <textarea name="address" defaultValue={business?.address || ""} />
        </label>
      </div>
      <button className="button primary" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Saving..." : "Save Profile"}
      </button>
      {message ? <p className={status === "error" ? "form-error" : "form-success"}>{message}</p> : null}
    </form>
  );
}
