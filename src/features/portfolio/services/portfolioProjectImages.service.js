import { supabase } from "../../../services/supabase";

const BUCKET = "portfolio-projects";

/**
 * Faz upload de uma imagem para o bucket de projetos.
 * @param {File} file
 * @param {string} userId
 * @returns {{path: string, publicUrl: string}}
 */
export async function uploadProjectImage(file, userId) {
  if (!file) return null;

  const extension = file.name.split(".").pop().toLowerCase();
  const fileName = `${userId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return {
    path: fileName,
    publicUrl,
  };
}

/**
 * Remove uma imagem do Storage.
 * @param {string} path
 */
export async function deleteProjectImage(path) {
  if (!path) return;

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
}

/**
 * Faz upload de uma imagem da galeria do projeto.
 */
export async function uploadProjectSlideImage(file, userId, projectId) {
  if (!file) return null;

  const extension = file.name.split(".").pop().toLowerCase();
  const fileName = `${userId}/${projectId}/slides/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return {
    path: fileName,
    publicUrl,
  };
}
