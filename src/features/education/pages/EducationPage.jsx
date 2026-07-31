import GraduationCap from "lucide-react/dist/esm/icons/graduation-cap";
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
import EducationCard from "../components/EducationCard";
import EducationFormModal from "../dialogs/EducationFormModal";
import { useEducation } from "../hooks/useEducation";
import {
  EMPTY_EDUCATION_FORM,
  educationToForm,
  normalizeEducationForm,
  validateEducationForm,
} from "../validation/education.validation";

const filters = ["Todos", "Publicado", "Rascunho"];

function getPublicationStatus(item) {
  return item.isPublished ? "Publicado" : "Rascunho";
}

function getEducationLabel(item) {
  return item.course || item.degree || "Formação";
}

export default function EducationPage() {
  const {
    educationItems,
    isLoading,
    isMutating,
    error,
    reloadEducation,
    createEducationItem,
    updateEducationItem,
    deleteEducationItem,
  } = useEducation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({
    ...EMPTY_EDUCATION_FORM,
  });

  const filteredItems = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return educationItems.filter((item) => {
      const matchesFilter =
        selectedFilter === "Todos" ||
        getPublicationStatus(item) === selectedFilter;

      const content = [
        item.institution,
        item.course,
        item.degree,
        item.fieldOfStudy,
        item.location,
        item.description,
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilter && content.includes(search);
    });
  }, [educationItems, searchTerm, selectedFilter]);

  function openNewModal() {
    setEditingId(null);
    setFormData({ ...EMPTY_EDUCATION_FORM });
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingId(item.id);
    setFormData(educationToForm(item));
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ ...EMPTY_EDUCATION_FORM });
  }

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "isCurrent" && checked ? { endDate: "" } : {}),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const message = validateEducationForm(formData);

    if (message) {
      toast.error(message);
      return;
    }

    try {
      const payload = normalizeEducationForm(formData);

      if (editingId) {
        await updateEducationItem(editingId, payload);
        toast.success("Formação atualizada com sucesso.");
      } else {
        await createEducationItem(payload);
        toast.success("Formação criada com sucesso.");
      }

      closeModal();
    } catch (requestError) {
      console.error("Erro ao salvar formação:", requestError);
      toast.error(
        requestError?.message ||
          "Não foi possível salvar a formação.",
      );
    }
  }

  async function handleDelete() {
    if (!itemToDelete) return;

    try {
      await deleteEducationItem(itemToDelete.id);
      toast.success(
        `“${getEducationLabel(itemToDelete)}” foi excluída.`,
      );
      setItemToDelete(null);
    } catch (requestError) {
      console.error("Erro ao excluir formação:", requestError);
      toast.error("Não foi possível excluir a formação.");
    }
  }

  function openCredential(item) {
    if (!item.certificateUrl) {
      toast.error(
        "Esta formação não possui um certificado cadastrado.",
      );
      return;
    }

    window.open(
      item.certificateUrl,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <>
      <div className="space-y-6">
        <ContentPageHeader
          title="Formação"
          description="Organize cursos, graduações e certificações exibidos no seu portfólio."
          action={
            <Button onClick={openNewModal}>
              <Plus size={18} />
              Nova formação
            </Button>
          }
        />

        <ContentToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Pesquisar formações..."
          filters={filters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        <section className="space-y-5">
          <ContentCollectionHeader
            title="Todas as formações"
            visibleCount={filteredItems.length}
            totalCount={educationItems.length}
            singularLabel="formação"
            pluralLabel="formações"
          />

          {isLoading ? (
            <ContentLoadingState message="Carregando formações..." />
          ) : error ? (
            <ContentErrorState
              title="Não foi possível carregar as formações"
              onRetry={reloadEducation}
            />
          ) : filteredItems.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <EducationCard
                  key={item.id}
                  education={item}
                  onOpenCredential={openCredential}
                  onEdit={openEditModal}
                  onDelete={setItemToDelete}
                />
              ))}
            </div>
          ) : (
            <ContentEmptyState
              icon={GraduationCap}
              title="Nenhuma formação encontrada"
              description="Adicione sua primeira formação ou altere os filtros."
              action={
                <Button onClick={openNewModal}>
                  <Plus size={18} />
                  Adicionar formação
                </Button>
              }
            />
          )}
        </section>
      </div>

      <EducationFormModal
        isOpen={isModalOpen}
        isEditing={Boolean(editingId)}
        formData={formData}
        onChange={handleInputChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isMutating={isMutating}
      />

      <DeleteConfirmationModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        isMutating={isMutating}
        title="Excluir formação"
        itemLabel={
          itemToDelete
            ? `A formação “${getEducationLabel(itemToDelete)}”`
            : "A formação selecionada"
        }
        confirmLabel="Excluir formação"
      />
    </>
  );
}
