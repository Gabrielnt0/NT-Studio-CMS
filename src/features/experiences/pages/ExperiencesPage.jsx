import BriefcaseBusiness from "lucide-react/dist/esm/icons/briefcase-business";
import Plus from "lucide-react/dist/esm/icons/plus";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  ContentCollectionHeader,
  ContentEmptyState,
  ContentErrorState,
  ContentLoadingState,
  ContentPageHeader,
  ContentToolbar,
  DeleteConfirmationModal,
} from "../../../components/content";
import Button from "../../../components/ui/Button";
import ExperienceCard from "../components/ExperienceCard";
import ExperienceFormModal from "../dialogs/ExperienceFormModal";
import { useExperiences } from "../hooks/useExperiences";
import {
  EMPTY_EXPERIENCE_FORM,
  experienceToForm,
  normalizeExperienceForm,
  validateExperienceForm,
} from "../validation/experience.validation";

const filters = ["Todos", "Publicado", "Rascunho"];

export default function ExperiencesPage() {
  const { experiences, isLoading, isMutating, error, reloadExperiences, createExperience, updateExperience, deleteExperience } = useExperiences();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [experienceToDelete, setExperienceToDelete] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_EXPERIENCE_FORM });

  const filteredExperiences = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return experiences.filter((experience) => {
      const matchesFilter = selectedFilter === "Todos" || experience.status === selectedFilter;
      const content = [experience.position, experience.company, experience.location, experience.description, ...experience.technologies].join(" ").toLowerCase();
      return matchesFilter && content.includes(search);
    });
  }, [experiences, searchTerm, selectedFilter]);

  function openNewExperienceModal() {
    setEditingExperienceId(null);
    setFormData({ ...EMPTY_EXPERIENCE_FORM });
    setIsModalOpen(true);
  }

  function openEditExperienceModal(experience) {
    setEditingExperienceId(experience.id);
    setFormData(experienceToForm(experience));
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingExperienceId(null);
    setFormData({ ...EMPTY_EXPERIENCE_FORM });
  }

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({ ...current, [name]: type === "checkbox" ? checked : value, ...(name === "isCurrent" && checked ? { endDate: "" } : {}) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validateExperienceForm(formData);
    if (validationMessage) return toast.error(validationMessage);

    const payload = normalizeExperienceForm(formData);
    try {
      if (editingExperienceId) {
        await updateExperience(editingExperienceId, payload);
        toast.success("Experiência atualizada com sucesso.");
      } else {
        await createExperience(payload);
        toast.success("Experiência criada com sucesso.");
      }
      closeModal();
    } catch (requestError) {
      toast.error(requestError?.message || "Não foi possível salvar a experiência.");
    }
  }

  async function handleDeleteExperience() {
    if (!experienceToDelete) return;
    try {
      await deleteExperience(experienceToDelete.id);
      toast.success(`"${experienceToDelete.position}" foi excluída.`);
      setExperienceToDelete(null);
    } catch {
      toast.error("Não foi possível excluir a experiência.");
    }
  }

  function openCompany(experience) {
    if (!experience.companyUrl) return toast.error("Esta experiência não possui um link cadastrado.");
    window.open(experience.companyUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className="space-y-6">
        <ContentPageHeader title="Experiências" description="Cadastre e organize as experiências profissionais do seu portfólio." action={<Button onClick={openNewExperienceModal}><Plus size={18} />Nova experiência</Button>} />
        <ContentToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Pesquisar experiências..." filters={filters} selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />

        <section className="space-y-5">
          <ContentCollectionHeader title="Todas as experiências" visibleCount={filteredExperiences.length} totalCount={experiences.length} singularLabel="experiência" pluralLabel="experiências" />
          {isLoading ? <ContentLoadingState message="Carregando experiências..." /> : error ? <ContentErrorState title="Não foi possível carregar as experiências" onRetry={reloadExperiences} /> : filteredExperiences.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredExperiences.map((experience) => <ExperienceCard key={experience.id} experience={experience} onOpenCompany={openCompany} onEdit={openEditExperienceModal} onDelete={setExperienceToDelete} />)}
            </div>
          ) : (
            <ContentEmptyState icon={BriefcaseBusiness} title="Nenhuma experiência encontrada" description="Adicione sua primeira experiência ou altere os filtros." action={<Button onClick={openNewExperienceModal}><Plus size={18} />Adicionar experiência</Button>} />
          )}
        </section>
      </div>

      <ExperienceFormModal isOpen={isModalOpen} isEditing={Boolean(editingExperienceId)} formData={formData} onChange={handleInputChange} onClose={closeModal} onSubmit={handleSubmit} isMutating={isMutating} />
      <DeleteConfirmationModal isOpen={Boolean(experienceToDelete)} onClose={() => setExperienceToDelete(null)} onConfirm={handleDeleteExperience} isMutating={isMutating} title="Excluir experiência" itemLabel={experienceToDelete ? `A experiência “${experienceToDelete.position}”` : "A experiência selecionada"} confirmLabel="Excluir experiência" />
    </>
  );
}
