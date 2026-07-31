import { supabase } from "../../../services/supabase";

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (diffMs < minute) {
    return "Agora mesmo";
  }

  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `há ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  }

  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `há ${hours} hora${hours > 1 ? "s" : ""}`;
  }

  if (diffMs < day * 2) {
    return "Ontem";
  }

  if (diffMs < day * 7) {
    const days = Math.floor(diffMs / day);
    return `há ${days} dias`;
  }

  return date.toLocaleDateString("pt-BR");
}

const PROJECT_COLUMNS = `
  id,
  user_id,
  title,
  description,
  category,
  status,
  featured,
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
    title: project.title,
    description: project.description,
    category: project.category,
    status: project.status,
    featured: project.featured,
    githubUrl: project.github_url ?? "",
    demoUrl: project.demo_url ?? "",
    imageUrl: project.image_url ?? "",

    createdAt: formatDate(project.created_at),
    updatedAt: formatDate(project.updated_at),

    // Datas originais preservadas para ordenação e integrações entre features.
    createdAtIso: project.created_at ?? null,
    updatedAtIso: project.updated_at ?? null,
  };
}

function mapProjectToDatabase(project) {
  return {
    title: project.title.trim(),
    description: project.description.trim(),
    category: project.category,
    status: project.status,
    featured: Boolean(project.featured),
    github_url: project.githubUrl?.trim() || null,
    demo_url: project.demoUrl?.trim() || null,
    image_url: project.imageUrl?.trim() || null,
  };
}

export async function getProjects() {
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select(PROJECT_COLUMNS)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapProjectFromDatabase);
}

export async function getProjectById(projectId) {
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select(PROJECT_COLUMNS)
    .eq("id", projectId)
    .single();

  if (error) {
    throw error;
  }

  return mapProjectFromDatabase(data);
}

export async function createProject(project) {
  const payload = mapProjectToDatabase(project);

  const { data, error } = await supabase
    .from("portfolio_projects")
    .insert(payload)
    .select(PROJECT_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return mapProjectFromDatabase(data);
}

export async function updateProject(projectId, project) {
  const payload = mapProjectToDatabase(project);

  const { data, error } = await supabase
    .from("portfolio_projects")
    .update(payload)
    .eq("id", projectId)
    .select(PROJECT_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return mapProjectFromDatabase(data);
}

export async function deleteProject(projectId) {
  const { error } = await supabase
    .from("portfolio_projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    throw error;
  }
}

export async function toggleProjectFeatured(projectId, featured) {
  const { data, error } = await supabase
    .from("portfolio_projects")
    .update({ featured })
    .eq("id", projectId)
    .select(PROJECT_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return mapProjectFromDatabase(data);
}
