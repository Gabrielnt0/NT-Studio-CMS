import Modal from "../../../components/feedback/Modal";
import FormCheckbox from "../../../components/form/FormCheckbox";
import FormTextarea from "../../../components/form/FormTextarea";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

const selectClass = "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

export default function ExperienceFormModal({ isOpen, isEditing, formData, onChange, onClose, onSubmit, isMutating }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar experiência" : "Nova experiência"} description="Preencha as informações da experiência profissional.">
      <form onSubmit={onSubmit}>
        <div className="grid gap-5 p-6 md:grid-cols-2">
          <Input label="Cargo" name="position" value={formData.position} onChange={onChange} placeholder="Ex.: Desenvolvedor Front-end" required />
          <Input label="Empresa" name="company" value={formData.company} onChange={onChange} placeholder="Ex.: NT Studio" required />

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Tipo de trabalho</label>
            <select name="employmentType" value={formData.employmentType} onChange={onChange} className={selectClass}>
              <option>Tempo integral</option><option>Meio período</option><option>Freelancer</option><option>Estágio</option><option>Autônomo</option>
            </select>
          </div>
          <Input label="Localização" name="location" value={formData.location} onChange={onChange} placeholder="Ex.: Remoto" />
          <Input label="Data de início" name="startDate" type="date" value={formData.startDate} onChange={onChange} required />
          <Input label="Data de término" name="endDate" type="date" value={formData.endDate} onChange={onChange} disabled={formData.isCurrent} min={formData.startDate || undefined} />

          <div className="md:col-span-2"><FormCheckbox label="Trabalho atualmente nesta empresa" name="isCurrent" checked={formData.isCurrent} onChange={onChange} /></div>
          <div className="md:col-span-2"><FormTextarea label="Descrição" name="description" value={formData.description} onChange={onChange} rows={5} resize={false} required placeholder="Descreva suas responsabilidades, resultados e principais atividades." /></div>
          <Input label="Tecnologias" name="technologiesText" value={formData.technologiesText} onChange={onChange} placeholder="React, JavaScript, Supabase" />
          <Input label="Site da empresa" name="companyUrl" type="url" value={formData.companyUrl} onChange={onChange} placeholder="https://..." />

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Status</label>
            <select name="status" value={formData.status} onChange={onChange} className={selectClass}><option>Rascunho</option><option>Publicado</option></select>
          </div>
          <div className="self-end"><FormCheckbox label="Destacar no portfólio" name="featured" checked={formData.featured} onChange={onChange} /></div>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-zinc-800 px-6 py-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={isMutating}>{isMutating ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar experiência"}</Button>
        </footer>
      </form>
    </Modal>
  );
}
