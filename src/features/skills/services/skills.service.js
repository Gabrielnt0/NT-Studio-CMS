import { supabase } from "../../../services/supabase";

const SKILL_COLUMNS = `
  id,
  user_id,
  name,
  category,
  level,
  description,
  icon,
  is_published,
  is_featured,
  display_order,
  created_at,
  updated_at
`;

function mapSkillFromDatabase(item) {
  return {
    id: item.id,
    userId: item.user_id,
    name: item.name ?? "",
    category: item.category ?? "",
    level: Number(item.level) || 0,
    description: item.description ?? "",
    icon: item.icon ?? "",
    isPublished: Boolean(item.is_published),
    isFeatured: Boolean(item.is_featured),
    displayOrder: Number(item.display_order) || 0,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

function mapSkillToDatabase(item) {
  return {
    name: item.name.trim(),
    category: item.category.trim(),
    level: Number(item.level) || 0,
    description: item.description?.trim() || null,
    icon: item.icon?.trim() || null,
    is_published: Boolean(item.isPublished),
    is_featured: Boolean(item.isFeatured),
    display_order: Number(item.displayOrder) || 0,
  };
}

export async function getSkillItems() {
  const { data, error } = await supabase
    .from("skills")
    .select(SKILL_COLUMNS)
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapSkillFromDatabase);
}

export async function createSkillItem(item) {
  const { data, error } = await supabase
    .from("skills")
    .insert(mapSkillToDatabase(item))
    .select(SKILL_COLUMNS)
    .single();

  if (error) throw error;
  return mapSkillFromDatabase(data);
}

export async function updateSkillItem(itemId, item) {
  const { data, error } = await supabase
    .from("skills")
    .update(mapSkillToDatabase(item))
    .eq("id", itemId)
    .select(SKILL_COLUMNS)
    .single();

  if (error) throw error;
  return mapSkillFromDatabase(data);
}

export async function deleteSkillItem(itemId) {
  const { error } = await supabase
    .from("skills")
    .delete()
    .eq("id", itemId);

  if (error) throw error;
}
