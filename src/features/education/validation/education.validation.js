export const EMPTY_EDUCATION_FORM = {
  institution: "",
  course: "",
  degree: "",
  fieldOfStudy: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  certificateUrl: "",
  isPublished: false,
  isFeatured: false,
  displayOrder: 0,
};

export function educationToForm(education) {
  return {
    institution: education.institution ?? "",
    course: education.course ?? "",
    degree: education.degree ?? "",
    fieldOfStudy: education.fieldOfStudy ?? "",
    location: education.location ?? "",
    startDate: education.startDate ?? "",
    endDate: education.endDate ?? "",
    isCurrent: Boolean(education.isCurrent),
    description: education.description ?? "",
    certificateUrl: education.certificateUrl ?? "",
    isPublished: Boolean(education.isPublished),
    isFeatured: Boolean(education.isFeatured),
    displayOrder: Number(education.displayOrder) || 0,
  };
}

export function validateEducationForm(formData) {
  if (!formData.institution.trim()) {
    return "Informe a instituição de ensino.";
  }

  if (!formData.course.trim()) {
    return "Informe o curso.";
  }

  if (!formData.startDate) {
    return "Informe a data de início.";
  }

  if (
    !formData.isCurrent &&
    formData.endDate &&
    formData.endDate < formData.startDate
  ) {
    return "A data de término não pode ser anterior à data de início.";
  }

  if (
    formData.certificateUrl.trim() &&
    !/^https?:\/\//i.test(formData.certificateUrl.trim())
  ) {
    return "Informe um link de certificado válido, começando com http:// ou https://.";
  }

  return null;
}

export function normalizeEducationForm(formData) {
  return {
    institution: formData.institution.trim(),
    course: formData.course.trim(),
    degree: formData.degree.trim(),
    fieldOfStudy: formData.fieldOfStudy.trim(),
    location: formData.location.trim(),
    startDate: formData.startDate,
    endDate: formData.isCurrent ? "" : formData.endDate,
    isCurrent: Boolean(formData.isCurrent),
    description: formData.description.trim(),
    certificateUrl: formData.certificateUrl.trim(),
    isPublished: Boolean(formData.isPublished),
    isFeatured: Boolean(formData.isFeatured),
    displayOrder: Number(formData.displayOrder) || 0,
  };
}
