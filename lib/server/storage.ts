import { getSupabaseConfig } from "@/lib/server/config";

type StorageBucketOptions = {
  id: string;
  public: boolean;
  fileSizeLimit: number;
  allowedMimeTypes: string[];
};

export function getStorageConfig() {
  const { url, serviceRoleKey } = getSupabaseConfig();

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase storage is not configured.");
  }

  return {
    baseUrl: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

export async function ensureStorageBucket(options: StorageBucketOptions) {
  const { baseUrl, serviceRoleKey } = getStorageConfig();
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({
    id: options.id,
    name: options.id,
    public: options.public,
    file_size_limit: options.fileSizeLimit,
    allowed_mime_types: options.allowedMimeTypes,
  });
  const updateResponse = await fetch(`${baseUrl}/storage/v1/bucket/${options.id}`, {
    method: "PUT",
    headers,
    body,
  });

  if (updateResponse.ok) {
    return;
  }

  const createResponse = await fetch(`${baseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers,
    body,
  });

  if (!createResponse.ok && createResponse.status !== 409) {
    const error = await createResponse.text().catch(() => "");
    throw new Error(error || `Storage bucket "${options.id}" could not be prepared.`);
  }
}
