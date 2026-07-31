import { supabase } from "../../../services/supabase";

function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  });
}

const EDUCATION_COLUMNS = `
  id,
  user_id,
  institution,
  course,
  degree,
  field_of_study,
  location,
  start_date,
  end_date,
  is_current,
  description,
  certificate_url,
  is_published,
  is_featured,
  display_order,
  created_at,
  updated_at
`;

function mapEducationFromDatabase(item) {
  return {
    id: item.id,
    userId: item.user_id,
    institution: item.institution ?? "",
    course: item.course ?? "",
    degree: item.degree ?? "",
    fieldOfStudy: item.field_of_study ?? "",
    location: item.location ?? "",
    startDate: item.start_date ?? "",
    endDate: item.end_date ?? "",
    isCurrent: Boolean(item.is_current),
    description: item.description ?? "",
    certificateUrl: item.certificate_url ?? "",
    isPublished: Boolean(item.is_published),
    isFeatured: Boolean(item.is_featured),
    displayOrder: Number(item.display_order) || 0,
    startDateLabel: formatDate(item.start_date),
    endDateLabel: item.is_current
      ? "Atualmente"
      : formatDate(item.end_date),
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

function mapEducationToDatabase(item) {
  return {
    institution: item.institution.trim(),
    course: item.course.trim(),
    degree: item.degree?.trim() || null,
    field_of_study: item.fieldOfStudy?.trim() || null,
    location: item.location?.trim() || null,
    start_date: item.startDate || null,
    end_date: item.isCurrent ? null : item.endDate || null,
    is_current: Boolean(item.isCurrent),
    description: item.description?.trim() || null,
    certificate_url: item.certificateUrl?.trim() || null,
    is_published: Boolean(item.isPublished),
    is_featured: Boolean(item.isFeatured),
    display_order: Number(item.displayOrder) || 0,
  };
}

export async function getEducationItems() {
  const { data, error } = await supabase
    .from("education")
    .select(EDUCATION_COLUMNS)
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true })
    .order("start_date", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(mapEducationFromDatabase);
}

export async function createEducationItem(item) {
  const { data, error } = await supabase
    .from("education")
    .insert(mapEducationToDatabase(item))
    .select(EDUCATION_COLUMNS)
    .single();

  if (error) throw error;

  return mapEducationFromDatabase(data);
}

export async function updateEducationItem(itemId, item) {
  const { data, error } = await supabase
    .from("education")
    .update(mapEducationToDatabase(item))
    .eq("id", itemId)
    .select(EDUCATION_COLUMNS)
    .single();

  if (error) throw error;

  return mapEducationFromDatabase(data);
}

export async function deleteEducationItem(itemId) {
  const { error } = await supabase
    .from("education")
    .delete()
    .eq("id", itemId);

  if (error) throw error;
}
