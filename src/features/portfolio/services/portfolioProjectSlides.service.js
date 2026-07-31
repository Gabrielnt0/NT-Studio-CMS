import { supabase } from "../../../services/supabase";
import { deleteProjectImage } from "./portfolioProjectImages.service";

const SLIDE_COLUMNS = `
  id,
  project_id,
  user_id,
  image_url,
  storage_path,
  alt_text,
  sort_order,
  created_at,
  updated_at
`;

function mapSlide(item) {
  return {
    id: item.id,
    projectId: item.project_id,
    userId: item.user_id,
    imageUrl: item.image_url,
    storagePath: item.storage_path,
    altText: item.alt_text ?? "",
    sortOrder: Number(item.sort_order) || 0,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export async function listProjectSlides(projectId) {
  const { data, error } = await supabase
    .from("portfolio_project_slides")
    .select(SLIDE_COLUMNS)
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map(mapSlide);
}

export async function createProjectSlide(slide) {
  const { data, error } = await supabase
    .from("portfolio_project_slides")
    .insert({
      project_id: slide.projectId,
      image_url: slide.imageUrl,
      storage_path: slide.storagePath,
      alt_text: slide.altText?.trim() || null,
      sort_order: Math.max(0, Number(slide.sortOrder) || 0),
    })
    .select(SLIDE_COLUMNS)
    .single();

  if (error) throw error;

  return mapSlide(data);
}

export async function deleteProjectSlide(slideId) {
  const { data, error } = await supabase
    .from("portfolio_project_slides")
    .delete()
    .eq("id", slideId)
    .select("storage_path")
    .single();

  if (error) throw error;

  if (data?.storage_path) {
    await deleteProjectImage(data.storage_path);
  }
}
