import { supabase } from "../../../services/supabase";

const TABLE_NAME = "media";

function mapMediaFromDatabase(item) {
  return {
    id: item.id,
    userId: item.user_id,
    name: item.name,
    fileName: item.file_name,
    publicUrl: item.public_url,
    storagePath: item.storage_path,
    mimeType: item.mime_type,
    size: item.size,
    width: item.width,
    height: item.height,
    altText: item.alt_text ?? "",
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

function mapMediaToDatabase(item) {
  return {
    name: item.name,
    file_name: item.fileName,
    public_url: item.publicUrl,
    storage_path: item.storagePath,
    mime_type: item.mimeType,
    size: item.size,
    width: item.width,
    height: item.height,
    alt_text: item.altText ?? "",
  };
}

export async function listMedia() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map(mapMediaFromDatabase);
}

export async function createMedia(media) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(mapMediaToDatabase(media))
    .select()
    .single();

  if (error) throw error;

  return mapMediaFromDatabase(data);
}

export async function updateMedia(id, media) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(mapMediaToDatabase(media))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return mapMediaFromDatabase(data);
}

export async function deleteMedia(id) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("id", id);

  if (error) throw error;
}