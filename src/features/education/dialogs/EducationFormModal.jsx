import Modal from "../../../components/feedback/Modal";
import FormCheckbox from "../../../components/form/FormCheckbox";
import FormTextarea from "../../../components/form/FormTextarea";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function EducationFormModal({
  isOpen,
  isEditing,
  formData,
  onChange,
  onClose,
  onSubmit,
  isMutating,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar formação" : "Nova formação"}
      description="Cadastre cursos, graduações e certificações do seu portfólio."
    >
      <form onSubmit={onSubmit}>
        <div className="grid gap-5 p-6 md:grid-cols-2">
          <Input
            label="Instituição"
            name="institution"
            value={formData.institution}
            onChange={onChange}
            placeholder="Ex.: Universidade ou plataforma"
            required
          />

          <Input
            label="Curso"
            name="course"
            value={formData.course}
            onChange={onChange}
            placeholder="Ex.: Desenvolvimento Web"
            required
          />

          <Input
            label="Grau ou tipo de formação"
            name="degree"
            value={formData.degree}
            onChange={onChange}
            placeholder="Ex.: Tecnólogo, Bacharelado ou Curso livre"
          />

          <Input
            label="Área de estudo"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={onChange}
            placeholder="Ex.: Tecnologia da Informação"
          />

          <Input
            label="Localização"
            name="location"
            value={formData.location}
            onChange={onChange}
            placeholder="Ex.: São Paulo, SP ou Online"
          />

          <Input
            label="Ordem de exibição"
            name="displayOrder"
            type="number"
            min="0"
            step="1"
            value={formData.displayOrder}
            onChange={onChange}
            placeholder="0"
          />

          <Input
            label="Data de início"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={onChange}
            required
          />

          <Input
            label="Data de término"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={onChange}
            disabled={formData.isCurrent}
            min={formData.startDate || undefined}
          />

          <div className="md:col-span-2">
            <FormCheckbox
              label="Estou estudando atualmente"
              name="isCurrent"
              checked={formData.isCurrent}
              onChange={onChange}
            />
          </div>

          <div className="md:col-span-2">
            <FormTextarea
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={5}
              resize={false}
              placeholder="Descreva conteúdos, competências e resultados dessa formação."
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Link do certificado"
              name="certificateUrl"
              type="url"
              value={formData.certificateUrl}
              onChange={onChange}
              placeholder="https://..."
            />
          </div>

          <div>
            <FormCheckbox
              label="Publicar no portfólio"
              name="isPublished"
              checked={formData.isPublished}
              onChange={onChange}
            />
          </div>

          <div>
            <FormCheckbox
              label="Destacar no portfólio"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={onChange}
            />
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-zinc-800 px-6 py-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>

          <Button type="submit" disabled={isMutating}>
            {isMutating
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Criar formação"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}
