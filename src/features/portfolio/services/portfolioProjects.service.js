import { supabase } from "../../../services/supabase";

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (diffMs < minute) return "Agora mesmo";

  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `há ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  }

  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `há ${hours} hora${hours > 1 ? "s" : ""}`;
  }

  if (diffMs < day * 2) return "Ontem";

  if (diffMs < day * 7) {
    const days = Math.floor(diffMs / day);
    return `há ${days} dias`;
  }

  return date.toLocaleDateString("pt-BR");
}

export function slugifyProjectTitle(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const PROJECT_COLUMNS = `
  id,
  user_id,
  title,
  slug,
  description,
  long_description,
  client,
  project_date,
  technologies,
  category,
  status,
  featured,
  is_published,
  display_order,
  github_url,
  demo_url,
  image_url,
  created_at,
  updated_at
`;

function mapProjectFromDatabase(project) {
  return {
    id: project.id,
    userId: project.user_id,
    title: project.title ?? "",
    slug: project.slug ?? "",
    description: project.description ?? "",
    longDescription: project.long_description ?? "",
    client: project.client ?? "",
    projectDate: project.project_date ?? "",
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : [],
    category: project.category ?? "Portfólio",
    status: project.status ?? "Rascunho",
    featured: Boolean(project.featured),
    isPublished: Boolean(project.is_published),
    displayOrder: Number(project.display_order) || 0,
    githubUrl: project.github_url ?? "",
    demoUrl: project.demo_url ?? "",
    imageUrl: project.image_url ?? "",
    createdAt: formatDate(project.created_at),
    updatedAt: formatDate(project.updated_at),
    createdAtIso: project.created_at ?? null,
    updatedAtIso: project.updated_at ?? null,
  };
}

function mapProjectToDatabase(project) {
  const title = project.title.trim();

  return {
    title,
    slug: slugifyProjectTitle(project.slug || title),
    description: project.description.trim(),
    long_description: project.longDescription?.trim() || null,
    client: project.client?.trim() || null,
    project_date: project.projectDate || null,
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : [],
    category: project.category,
    status: project.status,
    featured: Boolean(project.featured),
    is_published: Boolean(project.isPublished),
    display_order: Math.max(0, Number(project.displayOrder) || 0),
    github_url: project.githubUrl?.trim() || null,
    demo_url: project.demoUrl?.trim() || null,
    image_url: project.imageUrl?.trim() || null,
  };
}

export async function getProjects() {
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select(PROJECT_COLUMNS)
    .order("display_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(mapProjectFromDatabase);
}

export async function getProjectById(projectId) {
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select(PROJECT_COLUMNS)
    .eq("id", projectId)
    .single();

  if (error) throw error;

  return mapProjectFromDatabase(data);
}

export async function createProject(project) {
  const { data, error } = await supabase
    .from("portfolio_projects")
    .insert(mapProjectToDatabase(project))
    .select(PROJECT_COLUMNS)
    .single();

  if (error) throw error;

  return mapProjectFromDatabase(data);
}

export async function updateProject(projectId, project) {
  const { data, error } = await supabase
    .from("portfolio_projects")
    .update(mapProjectToDatabase(project))
    .eq("id", projectId)
    .select(PROJECT_COLUMNS)
    .single();

  if (error) throw error;

  return mapProjectFromDatabase(data);
}

export async function deleteProject(projectId) {
  const { error } = await supabase
    .from("portfolio_projects")
    .delete()
    .eq("id", projectId);

  if (error) throw error;
}

export async function toggleProjectFeatured(projectId, featured) {
  const { data, error } = await supabase
    .from("portfolio_projects")
    .update({ featured })
    .eq("id", projectId)
    .select(PROJECT_COLUMNS)
    .single();

  if (error) throw error;

  return mapProjectFromDatabase(data);
}
