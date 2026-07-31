import { supabase } from "../../../services/supabase";

const BUCKET = "media";

export async function uploadMedia(file, userId) {
  const extension = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${extension}`;

  const storagePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  return {
    publicUrl,
    storagePath,
  };
}

export async function deleteMediaFile(storagePath) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (error) throw error;
}