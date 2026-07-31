export const EMPTY_SKILL_FORM = {
  name: "",
  category: "",
  level: 50,
  description: "",
  icon: "",
  isPublished: false,
  isFeatured: false,
  displayOrder: 0,
};

export function skillToForm(skill) {
  return {
    name: skill.name ?? "",
    category: skill.category ?? "",
    level: Number(skill.level) || 0,
    description: skill.description ?? "",
    icon: skill.icon ?? "",
    isPublished: Boolean(skill.isPublished),
    isFeatured: Boolean(skill.isFeatured),
    displayOrder: Number(skill.displayOrder) || 0,
  };
}

export function validateSkillForm(formData) {
  if (!formData.name.trim()) return "Informe o nome da habilidade.";
  if (!formData.category.trim()) return "Informe a categoria da habilidade.";

  const level = Number(formData.level);
  if (!Number.isFinite(level) || level < 0 || level > 100) {
    return "O nível deve estar entre 0 e 100.";
  }

  return null;
}

export function normalizeSkillForm(formData) {
  return {
    name: formData.name.trim(),
    category: formData.category.trim(),
    level: Number(formData.level) || 0,
    description: formData.description.trim(),
    icon: formData.icon.trim(),
    isPublished: Boolean(formData.isPublished),
    isFeatured: Boolean(formData.isFeatured),
    displayOrder: Number(formData.displayOrder) || 0,
  };
}
