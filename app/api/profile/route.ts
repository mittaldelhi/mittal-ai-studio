import { fail, ok, readString } from "@/lib/server/api";
import { ensureStorageBucket, getStorageConfig } from "@/lib/server/storage";
import { requireCurrentUser, supabaseRest } from "@/lib/server/supabase-rest";

const maxAvatarBytes = 15 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await requireCurrentUser().catch(() => null);

  if (!user) {
    return fail("Login required.", 401);
  }

  const contentType = request.headers.get("content-type") || "";
  const body =
    contentType.includes("multipart/form-data")
      ? Object.fromEntries(await request.formData())
      : ((await request.json().catch(() => null)) as Record<string, unknown> | null);
  let avatarUrl = readString(body?.avatar_url) || user.profile?.avatar_url || "";
  const avatarFile = body?.avatar instanceof File && body.avatar.size > 0 ? body.avatar : null;

  if (avatarFile) {
    if (!avatarFile.type.startsWith("image/")) {
      return fail("Profile photo must be an image.", 422);
    }

    if (avatarFile.size > maxAvatarBytes) {
      return fail("Profile photo must be smaller than 15 MB.", 422);
    }

    let storageConfig: ReturnType<typeof getStorageConfig>;

    try {
      storageConfig = getStorageConfig();
      await ensureStorageBucket({
        id: "avatars",
        public: true,
        fileSizeLimit: maxAvatarBytes,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      });
    } catch (error) {
      return fail(error instanceof Error ? error.message : "Supabase storage is not configured.", 500);
    }

    const extension = avatarFile.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const storagePath = `${user.id}/${Date.now()}.${extension}`;
    const uploadResponse = await fetch(`${storageConfig.baseUrl}/storage/v1/object/avatars/${storagePath}`, {
      method: "POST",
      headers: {
        apikey: storageConfig.serviceRoleKey,
        Authorization: `Bearer ${storageConfig.serviceRoleKey}`,
        "Content-Type": avatarFile.type,
        "x-upsert": "true",
      },
      body: await avatarFile.arrayBuffer(),
    });

    if (!uploadResponse.ok) {
      const uploadError = await uploadResponse.text().catch(() => "");
      return fail(uploadError || "Profile photo upload failed.", 500);
    }

    avatarUrl = `${storageConfig.baseUrl}/storage/v1/object/public/avatars/${storagePath}`;
  }

  await supabaseRest("/rest/v1/profiles", {
    method: "PATCH",
    service: true,
    query: { id: `eq.${user.id}` },
    body: {
      full_name: readString(body?.full_name),
      avatar_url: avatarUrl || null,
      phone: readString(body?.phone),
      whatsapp: readString(body?.whatsapp),
    },
  });

  await supabaseRest("/rest/v1/business_profiles", {
    method: "PATCH",
    service: true,
    query: { user_id: `eq.${user.id}` },
    body: {
      business_name: readString(body?.business_name),
      business_type: readString(body?.business_type),
      address: readString(body?.address),
      city: readString(body?.city),
      service_interest: readString(body?.service_interest),
    },
  });

  return ok({ saved: true });
}
