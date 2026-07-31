import Pencil from "lucide-react/dist/esm/icons/pencil";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import Wrench from "lucide-react/dist/esm/icons/wrench";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

export default function SkillCard({ skill, onEdit, onDelete }) {
  return (
    <article className="flex min-h-64 flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-zinc-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          {skill.icon ? <span className="text-xl" aria-hidden="true">{skill.icon}</span> : <Wrench size={23} />}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Badge variant={skill.isPublished ? "green" : "zinc"}>
            {skill.isPublished ? "Publicado" : "Rascunho"}
          </Badge>
          {skill.isFeatured && <Badge variant="purple">Destaque</Badge>}
        </div>
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-blue-400">{skill.category}</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{skill.name}</h3>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
          <span>Nível</span>
          <span>{skill.level}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${skill.level}%` }} />
        </div>
      </div>

      {skill.description && <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-400">{skill.description}</p>}

      <div className="mt-auto flex justify-end gap-1 border-t border-zinc-800 pt-4">
        <Button variant="ghost" size="icon" onClick={() => onEdit(skill)} title="Editar habilidade" aria-label="Editar habilidade"><Pencil size={17} /></Button>
        <Button variant="danger" size="icon" onClick={() => onDelete(skill)} title="Excluir habilidade" aria-label="Excluir habilidade"><Trash2 size={17} /></Button>
      </div>
    </article>
  );
}
