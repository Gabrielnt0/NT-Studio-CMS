import { supabase } from "../../../services/supabase";

function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  });
}

const EXPERIENCE_COLUMNS = `
  id,
  user_id,
  position,
  company,
  employment_type,
  location,
  start_date,
  end_date,
  is_current,
  description,
  technologies,
  company_url,
  status,
  featured,
  created_at,
  updated_at
`;

function mapExperienceFromDatabase(experience) {
  return {
    id: experience.id,
    userId: experience.user_id,
    position: experience.position,
    company: experience.company,
    employmentType: experience.employment_type ?? "",
    location: experience.location ?? "",
    startDate: experience.start_date ?? "",
    endDate: experience.end_date ?? "",
    isCurrent: Boolean(experience.is_current),
    description: experience.description ?? "",
    technologies: experience.technologies ?? [],
    companyUrl: experience.company_url ?? "",
    status: experience.status ?? "Rascunho",
    featured: Boolean(experience.featured),
    startDateLabel: formatDate(experience.start_date),
    endDateLabel: experience.is_current
      ? "Atualmente"
      : formatDate(experience.end_date),
    createdAt: experience.created_at,
    updatedAt: experience.updated_at,
  };
}

function mapExperienceToDatabase(experience) {
  return {
    position: experience.position.trim(),
    company: experience.company.trim(),
    employment_type: experience.employmentType?.trim() || null,
    location: experience.location?.trim() || null,
    start_date: experience.startDate || null,
    end_date: experience.isCurrent ? null : experience.endDate || null,
    is_current: Boolean(experience.isCurrent),
    description: experience.description?.trim() || null,
    technologies: Array.isArray(experience.technologies)
      ? experience.technologies
      : [],
    company_url: experience.companyUrl?.trim() || null,
    status: experience.status,
    featured: Boolean(experience.featured),
  };
}

export async function getExperiences() {
  const { data, error } = await supabase
    .from("experiences")
    .select(EXPERIENCE_COLUMNS)
    .order("start_date", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(mapExperienceFromDatabase);
}

export async function createExperience(experience) {
  const payload = mapExperienceToDatabase(experience);

  const { data, error } = await supabase
    .from("experiences")
    .insert(payload)
    .select(EXPERIENCE_COLUMNS)
    .single();

  if (error) throw error;

  return mapExperienceFromDatabase(data);
}

export async function updateExperience(experienceId, experience) {
  const payload = mapExperienceToDatabase(experience);

  const { data, error } = await supabase
    .from("experiences")
    .update(payload)
    .eq("id", experienceId)
    .select(EXPERIENCE_COLUMNS)
    .single();

  if (error) throw error;

  return mapExperienceFromDatabase(data);
}

export async function deleteExperience(experienceId) {
  const { error } = await supabase
    .from("experiences")
    .delete()
    .eq("id", experienceId);

  if (error) throw error;
}
