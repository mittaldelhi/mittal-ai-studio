"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type ProjectRow = {
  id?: string;
  title?: string;
  client_name?: string;
  category?: string;
  city?: string | null;
  live_url?: string;
  description?: string;
  result?: string;
  tags?: string[] | null;
  services_delivered?: string[] | null;
  image_url?: string | null;
  active?: boolean;
  featured?: boolean;
  sort_order?: number | null;
};

function lines(value: FormDataEntryValue | null) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toProjectData(form: HTMLFormElement) {
  const data = new FormData(form);

  return {
    title: String(data.get("title") || "").trim(),
    client_name: String(data.get("client_name") || "").trim(),
    category: String(data.get("category") || "").trim(),
    city: String(data.get("city") || "").trim(),
    live_url: String(data.get("live_url") || "").trim(),
    description: String(data.get("description") || "").trim(),
    result: String(data.get("result") || "").trim(),
    tags: lines(data.get("tags")),
    services_delivered: lines(data.get("services_delivered")),
    image_url: String(data.get("image_url") || "").trim() || null,
    active: data.get("active") === "on",
    featured: data.get("featured") === "on",
    sort_order: Number(data.get("sort_order") || 0),
  };
}

function createSavePayload(form: HTMLFormElement, id?: string) {
  const formData = new FormData(form);
  const screenshot = formData.get("screenshot");
  const payload = new FormData();

  payload.set("table", "portfolio_projects");
  payload.set("data", JSON.stringify(toProjectData(form)));

  if (id) {
    payload.set("id", id);
  }

  if (screenshot instanceof File && screenshot.size > 0) {
    payload.set("screenshot", screenshot);
  }

  return payload;
}

function PortfolioScreenshotPicker({ currentUrl }: { currentUrl?: string | null }) {
  const [preview, setPreview] = useState(currentUrl || "");
  const [objectUrl, setObjectUrl] = useState("");

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  function updatePreview(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl("");
    }

    if (!file) {
      setPreview(currentUrl || "");
      return;
    }

    if (!file.type.startsWith("image/")) {
      event.currentTarget.value = "";
      setPreview(currentUrl || "");
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    setObjectUrl(nextPreview);
    setPreview(nextPreview);
  }

  return (
    <div className="portfolio-image-picker">
      <input name="image_url" type="hidden" defaultValue={currentUrl || ""} />
      {preview ? (
        <div className="portfolio-image-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src={preview} />
        </div>
      ) : null}
      <label>
        Screenshot image
        <input accept="image/*" name="screenshot" type="file" onChange={updatePreview} />
        <span className="field-help">Choose a screenshot from your computer. It uploads in original quality.</span>
      </label>
    </div>
  );
}

export function PortfolioProjectManager({ projects }: { projects: ProjectRow[] }) {
  const [status, setStatus] = useState("");

  async function save(event: FormEvent<HTMLFormElement>, id?: string) {
    event.preventDefault();
    setStatus("Saving project...");

    const response = await fetch("/api/admin/records", {
      method: id ? "PATCH" : "POST",
      body: createSavePayload(event.currentTarget, id),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    setStatus(response.ok ? "Project saved. Refresh the homepage to see changes." : payload?.error || "Project save failed.");
  }

  async function remove(id?: string) {
    if (!id) {
      return;
    }

    setStatus("Deleting project...");
    const response = await fetch("/api/admin/records", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "portfolio_projects", id }),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    setStatus(response.ok ? "Project deleted. Refresh to update the list." : payload?.error || "Project delete failed.");
  }

  function renderForm(project?: ProjectRow) {
    return (
      <form className="portal-form" onSubmit={(event) => save(event, project?.id)}>
        <label>Title<input name="title" required defaultValue={project?.title || ""} /></label>
        <label>Client / business name<input name="client_name" required defaultValue={project?.client_name || ""} /></label>
        <label>Category<input name="category" required defaultValue={project?.category || ""} /></label>
        <label>City / location<input name="city" defaultValue={project?.city || ""} /></label>
        <label>Live URL<input name="live_url" required defaultValue={project?.live_url || ""} /></label>
        <label>Result / outcome<input name="result" required defaultValue={project?.result || ""} /></label>
        <label>Short description<textarea name="description" required defaultValue={project?.description || ""} /></label>
        <label>Tags, one per line<textarea name="tags" defaultValue={(project?.tags || []).join("\n")} /></label>
        <label>Services delivered, one per line<textarea name="services_delivered" defaultValue={(project?.services_delivered || []).join("\n")} /></label>
        <PortfolioScreenshotPicker currentUrl={project?.image_url} />
        <label>Sort order<input name="sort_order" type="number" defaultValue={project?.sort_order ?? 10} /></label>
        <label className="check-row"><input name="active" type="checkbox" defaultChecked={project?.active !== false} /> Active</label>
        <label className="check-row"><input name="featured" type="checkbox" defaultChecked={Boolean(project?.featured)} /> Featured</label>
        <button className="button primary" type="submit">{project ? "Save Project" : "Create Project"}</button>
        {project?.id ? (
          <button className="button secondary" onClick={() => void remove(project.id)} type="button">
            Delete Project
          </button>
        ) : null}
      </form>
    );
  }

  return (
    <div className="admin-crud">
      <div className="data-card">
        <h2>Add portfolio project</h2>
        {renderForm()}
      </div>
      {projects.map((project) => (
        <div className="data-card" key={project.id || project.title}>
          <h2>{project.title}</h2>
          {renderForm(project)}
        </div>
      ))}
      {status ? <p className="form-success">{status}</p> : null}
    </div>
  );
}
