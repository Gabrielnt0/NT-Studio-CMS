import BriefcaseBusiness from "lucide-react/dist/esm/icons/briefcase-business";
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import Pencil from "lucide-react/dist/esm/icons/pencil";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

function statusVariant(status) {
  return status === "Publicado" ? "green" : "zinc";
}

export default function ExperienceCard({ experience, onOpenCompany, onEdit, onDelete }) {
  return (
    <article className="flex min-h-72 flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-zinc-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <BriefcaseBusiness size={23} />
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Badge variant={statusVariant(experience.status)}>{experience.status}</Badge>
          {experience.featured && <Badge variant="purple">Destaque</Badge>}
        </div>
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-blue-400">{experience.company}</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{experience.position}</h3>
      <p className="mt-1 text-sm text-zinc-500">{experience.startDateLabel} — {experience.endDateLabel}</p>
      {experience.location && <p className="mt-1 text-sm text-zinc-500">{experience.location}</p>}
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-400">{experience.description}</p>

      {experience.technologies.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {experience.technologies.slice(0, 4).map((technology) => <Badge key={technology} variant="zinc">{technology}</Badge>)}
          {experience.technologies.length > 4 && <Badge variant="zinc">+{experience.technologies.length - 4}</Badge>}
        </div>
      )}

      <div className="mt-auto flex justify-end gap-1 border-t border-zinc-800 pt-4">
        <Button variant="ghost" size="icon" onClick={() => onOpenCompany(experience)} title="Abrir empresa" aria-label="Abrir site da empresa"><ExternalLink size={17} /></Button>
        <Button variant="ghost" size="icon" onClick={() => onEdit(experience)} title="Editar experiência" aria-label="Editar experiência"><Pencil size={17} /></Button>
        <Button variant="danger" size="icon" onClick={() => onDelete(experience)} title="Excluir experiência" aria-label="Excluir experiência"><Trash2 size={17} /></Button>
      </div>
    </article>
  );
}
