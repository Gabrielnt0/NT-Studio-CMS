import { supabase } from "../../../services/supabase";

const BUCKET = "profile-avatars";

export async function uploadProfileAvatar(file, userId) {
  if (!file) return null;

  const extension = file.name.split(".").pop().toLowerCase();
  const filePath = `${userId}/avatar-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl,
  };
}

export async function deleteProfileAvatar(path) {
  if (!path) return;

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path]);

  if (error) throw error;
}

export function getProfileAvatarPath(avatarUrl) {
  if (!avatarUrl) return "";

  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const markerIndex = avatarUrl.indexOf(marker);

  if (markerIndex === -1) return "";

  return decodeURIComponent(
    avatarUrl.slice(markerIndex + marker.length).split("?")[0],
  );
}
