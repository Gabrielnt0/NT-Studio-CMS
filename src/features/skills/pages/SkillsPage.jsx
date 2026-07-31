import Plus from "lucide-react/dist/esm/icons/plus";
import Wrench from "lucide-react/dist/esm/icons/wrench";
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
import SkillCard from "../components/SkillCard";
import SkillFormModal from "../dialogs/SkillFormModal";
import { useSkills } from "../hooks/useSkills";
import {
  EMPTY_SKILL_FORM,
  normalizeSkillForm,
  skillToForm,
  validateSkillForm,
} from "../validation/skills.validation";

const filters = ["Todos", "Publicado", "Rascunho"];
const getPublicationStatus = (item) => item.isPublished ? "Publicado" : "Rascunho";

export default function SkillsPage() {
  const {
    skillItems,
    isLoading,
    isMutating,
    error,
    reloadSkills,
    createSkillItem,
    updateSkillItem,
    deleteSkillItem,
  } = useSkills();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_SKILL_FORM });

  const filteredItems = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return skillItems.filter((item) => {
      const matchesFilter = selectedFilter === "Todos" || getPublicationStatus(item) === selectedFilter;
      const content = [item.name, item.category, item.description].join(" ").toLowerCase();
      return matchesFilter && content.includes(search);
    });
  }, [skillItems, searchTerm, selectedFilter]);

  function openNewModal() {
    setEditingId(null);
    setFormData({ ...EMPTY_SKILL_FORM });
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingId(item.id);
    setFormData(skillToForm(item));
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ ...EMPTY_SKILL_FORM });
  }

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const message = validateSkillForm(formData);
    if (message) return toast.error(message);

    try {
      const payload = normalizeSkillForm(formData);
      if (editingId) {
        await updateSkillItem(editingId, payload);
        toast.success("Habilidade atualizada com sucesso.");
      } else {
        await createSkillItem(payload);
        toast.success("Habilidade criada com sucesso.");
      }
      closeModal();
    } catch (requestError) {
      console.error("Erro ao salvar habilidade:", requestError);
      toast.error(requestError?.message || "Não foi possível salvar a habilidade.");
    }
  }

  async function handleDelete() {
    if (!itemToDelete) return;
    try {
      await deleteSkillItem(itemToDelete.id);
      toast.success(`“${itemToDelete.name}” foi excluída.`);
      setItemToDelete(null);
    } catch (requestError) {
      console.error("Erro ao excluir habilidade:", requestError);
      toast.error("Não foi possível excluir a habilidade.");
    }
  }

  return (
    <>
      <div className="space-y-6">
        <ContentPageHeader
          title="Habilidades"
          description="Organize competências técnicas, criativas e profissionais exibidas no seu portfólio."
          action={<Button onClick={openNewModal}><Plus size={18} />Nova habilidade</Button>}
        />

        <ContentToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Pesquisar habilidades..."
          filters={filters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        <section className="space-y-5">
          <ContentCollectionHeader
            title="Todas as habilidades"
            visibleCount={filteredItems.length}
            totalCount={skillItems.length}
            singularLabel="habilidade"
            pluralLabel="habilidades"
          />

          {isLoading ? (
            <ContentLoadingState message="Carregando habilidades..." />
          ) : error ? (
            <ContentErrorState title="Não foi possível carregar as habilidades" onRetry={reloadSkills} />
          ) : filteredItems.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <SkillCard key={item.id} skill={item} onEdit={openEditModal} onDelete={setItemToDelete} />
              ))}
            </div>
          ) : (
            <ContentEmptyState
              icon={Wrench}
              title="Nenhuma habilidade encontrada"
              description="Adicione sua primeira habilidade ou altere os filtros."
              action={<Button onClick={openNewModal}><Plus size={18} />Adicionar habilidade</Button>}
            />
          )}
        </section>
      </div>

      <SkillFormModal
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
        title="Excluir habilidade"
        itemLabel={itemToDelete ? `A habilidade “${itemToDelete.name}”` : "A habilidade selecionada"}
        confirmLabel="Excluir habilidade"
      />
    </>
  );
}
