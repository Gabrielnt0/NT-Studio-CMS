export const EMPTY_EXPERIENCE_FORM = {
  position: "",
  company: "",
  employmentType: "Tempo integral",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  technologiesText: "",
  companyUrl: "",
  status: "Rascunho",
  featured: false,
};

export function experienceToForm(experience) {
  return {
    position: experience.position ?? "",
    company: experience.company ?? "",
    employmentType: experience.employmentType || "Tempo integral",
    location: experience.location ?? "",
    startDate: experience.startDate ?? "",
    endDate: experience.endDate ?? "",
    isCurrent: Boolean(experience.isCurrent),
    description: experience.description ?? "",
    technologiesText: (experience.technologies ?? []).join(", "),
    companyUrl: experience.companyUrl ?? "",
    status: experience.status || "Rascunho",
    featured: Boolean(experience.featured),
  };
}

export function normalizeExperienceForm(formData) {
  return {
    ...formData,
    position: formData.position.trim(),
    company: formData.company.trim(),
    location: formData.location.trim(),
    description: formData.description.trim(),
    companyUrl: formData.companyUrl.trim(),
    technologies: formData.technologiesText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

export function validateExperienceForm(formData) {
  if (!formData.position.trim()) return "Informe o cargo.";
  if (!formData.company.trim()) return "Informe a empresa.";
  if (!formData.startDate) return "Informe a data de início.";
  if (!formData.isCurrent && formData.endDate && formData.endDate < formData.startDate) {
    return "A data de término não pode ser anterior à data de início.";
  }
  if (!formData.description.trim()) return "Informe uma descrição.";
  return null;
}
