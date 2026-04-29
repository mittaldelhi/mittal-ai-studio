import { fail, ok, readString } from "@/lib/server/api";
import { isAdminTable } from "@/lib/server/admin";
import { ensureStorageBucket, getStorageConfig } from "@/lib/server/storage";
import { getCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";

const maxPortfolioImageBytes = 15 * 1024 * 1024;

async function requireAdminApi() {
  const user = await getCurrentUser().catch(() => null);
  return user?.profile?.role === "admin" || user?.profile?.role === "support" ? user : null;
}

function parseData(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

async function readRequest(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const table = readString(form.get("table"));
    const id = readString(form.get("id"));
    const data = parseData(form.get("data"));
    const screenshot = form.get("screenshot");

    return {
      table,
      id,
      data,
      screenshot: screenshot instanceof File && screenshot.size > 0 ? screenshot : null,
    };
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const table = readString(body?.table);
  const id = readString(body?.id);
  const data = typeof body?.data === "object" && body.data !== null ? (body.data as Record<string, unknown>) : {};
  return { table, id, data, screenshot: null };
}

function cleanFileName(name: string) {
  const clean = name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const extension = name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";

  return `${clean || "portfolio-screenshot"}.${extension}`;
}

async function uploadPortfolioScreenshot(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Portfolio screenshot must be an image.");
  }

  if (file.size > maxPortfolioImageBytes) {
    throw new Error("Portfolio screenshot must be smaller than 15 MB.");
  }

  await ensureStorageBucket({
    id: "portfolio",
    public: true,
    fileSizeLimit: maxPortfolioImageBytes,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });

  const { baseUrl, serviceRoleKey } = getStorageConfig();
  const storagePath = `work/${Date.now()}-${cleanFileName(file.name)}`;
  const uploadResponse = await fetch(`${baseUrl}/storage/v1/object/portfolio/${storagePath}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: await file.arrayBuffer(),
  });

  if (!uploadResponse.ok) {
    const uploadError = await uploadResponse.text().catch(() => "");
    throw new Error(uploadError || "Portfolio screenshot upload failed.");
  }

  return `${baseUrl}/storage/v1/object/public/portfolio/${storagePath}`;
}

async function withPortfolioScreenshot(data: Record<string, unknown>, screenshot: File | null) {
  if (!screenshot) {
    return data;
  }

  return {
    ...data,
    image_url: await uploadPortfolioScreenshot(screenshot),
  };
}

export async function POST(request: Request) {
  const user = await requireAdminApi();

  if (!user) {
    return fail("Admin access required.", 403);
  }

  const { table, data, screenshot } = await readRequest(request);

  if (!isAdminTable(table)) {
    return fail("Table is not allowed.", 422);
  }

  let saveData = data;

  if (table === "portfolio_projects") {
    try {
      saveData = await withPortfolioScreenshot(data, screenshot);
    } catch (error) {
      return fail(error instanceof Error ? error.message : "Portfolio screenshot upload failed.", 422);
    }
  }

  const rows = await supabaseRest<Array<Record<string, unknown>>>(`/rest/v1/${table}`, {
    method: "POST",
    service: true,
    prefer: "return=representation",
    body: saveData,
  });

  return ok({ row: rows[0] || null });
}

export async function PATCH(request: Request) {
  const user = await requireAdminApi();

  if (!user) {
    return fail("Admin access required.", 403);
  }

  const { table, id, data, screenshot } = await readRequest(request);

  if (!isAdminTable(table) || !id) {
    return fail("Table and id are required.", 422);
  }

  let saveData = data;

  if (table === "portfolio_projects") {
    try {
      saveData = await withPortfolioScreenshot(data, screenshot);
    } catch (error) {
      return fail(error instanceof Error ? error.message : "Portfolio screenshot upload failed.", 422);
    }
  }

  await supabaseRest(`/rest/v1/${table}`, {
    method: "PATCH",
    service: true,
    query: { id: `eq.${id}` },
    body: saveData,
  });

  return ok({ updated: true });
}

export async function DELETE(request: Request) {
  const user = await requireAdminApi();

  if (!user) {
    return fail("Admin access required.", 403);
  }

  const { table, id } = await readRequest(request);

  if (!isAdminTable(table) || !id) {
    return fail("Table and id are required.", 422);
  }

  await supabaseRest(`/rest/v1/${table}`, {
    method: "DELETE",
    service: true,
    query: { id: `eq.${id}` },
  });

  return ok({ deleted: true });
}
