import Modal from "../../../components/feedback/Modal";
import FormCheckbox from "../../../components/form/FormCheckbox";
import FormTextarea from "../../../components/form/FormTextarea";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function SkillFormModal({ isOpen, isEditing, formData, onChange, onClose, onSubmit, isMutating }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar habilidade" : "Nova habilidade"}
      description="Cadastre conhecimentos técnicos, criativos e profissionais."
    >
      <form onSubmit={onSubmit}>
        <div className="grid gap-5 p-6 md:grid-cols-2">
          <Input label="Nome da habilidade" name="name" value={formData.name} onChange={onChange} placeholder="Ex.: JavaScript" required />
          <Input label="Categoria" name="category" value={formData.category} onChange={onChange} placeholder="Ex.: Desenvolvimento Web" required />
          <Input label="Nível de domínio" name="level" type="number" min="0" max="100" step="1" value={formData.level} onChange={onChange} required />
          <Input label="Ordem de exibição" name="displayOrder" type="number" min="0" step="1" value={formData.displayOrder} onChange={onChange} />
          <Input label="Ícone ou emoji" name="icon" value={formData.icon} onChange={onChange} placeholder="Ex.: 💻" />
          <div className="hidden md:block" />
          <div className="md:col-span-2">
            <FormTextarea label="Descrição" name="description" value={formData.description} onChange={onChange} rows={4} resize={false} placeholder="Descreva como você utiliza essa habilidade." />
          </div>
          <div><FormCheckbox label="Publicar no portfólio" name="isPublished" checked={formData.isPublished} onChange={onChange} /></div>
          <div><FormCheckbox label="Destacar no portfólio" name="isFeatured" checked={formData.isFeatured} onChange={onChange} /></div>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-zinc-800 px-6 py-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={isMutating}>
            {isMutating ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar habilidade"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}
