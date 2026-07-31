import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import GraduationCap from "lucide-react/dist/esm/icons/graduation-cap";
import Pencil from "lucide-react/dist/esm/icons/pencil";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

export default function EducationCard({
  education,
  onOpenCredential,
  onEdit,
  onDelete,
}) {
  const title = education.course || education.degree || "Formação";

  return (
    <article className="flex min-h-72 flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-zinc-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
          <GraduationCap size={24} />
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Badge variant={education.isPublished ? "green" : "zinc"}>
            {education.isPublished ? "Publicado" : "Rascunho"}
          </Badge>

          {education.isFeatured && (
            <Badge variant="purple">Destaque</Badge>
          )}
        </div>
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-violet-400">
        {education.institution}
      </p>

      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>

      {education.degree && education.degree !== title && (
        <p className="mt-1 text-sm text-zinc-300">{education.degree}</p>
      )}

      {education.fieldOfStudy && (
        <p className="mt-1 text-sm text-zinc-400">
          {education.fieldOfStudy}
        </p>
      )}

      <p className="mt-2 text-sm text-zinc-500">
        {education.startDateLabel} — {education.endDateLabel}
      </p>

      {education.location && (
        <p className="mt-1 text-sm text-zinc-500">{education.location}</p>
      )}

      {education.description && (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-400">
          {education.description}
        </p>
      )}

      <div className="mt-auto flex justify-end gap-1 border-t border-zinc-800 pt-4">
        {education.certificateUrl && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenCredential(education)}
            title="Abrir certificado"
            aria-label="Abrir certificado"
          >
            <ExternalLink size={17} />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(education)}
          title="Editar formação"
          aria-label="Editar formação"
        >
          <Pencil size={17} />
        </Button>

        <Button
          variant="danger"
          size="icon"
          onClick={() => onDelete(education)}
          title="Excluir formação"
          aria-label="Excluir formação"
        >
          <Trash2 size={17} />
        </Button>
      </div>
    </article>
  );
}
