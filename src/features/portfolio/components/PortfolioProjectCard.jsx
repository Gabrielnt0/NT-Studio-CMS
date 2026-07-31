import {
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

export default function PortfolioProjectCard({
  project,
  statusVariant = "zinc",
  onOpen,
  onEdit,
  onDelete,
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/20">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-zinc-800 bg-zinc-950">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={`Capa do projeto ${project.title}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950">
            <span className="text-4xl font-bold text-blue-400/70">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3">
          <Badge variant={statusVariant}>{project.status}</Badge>
        </div>

        {project.featured && (
          <div className="absolute right-3 top-3">
            <Badge variant="purple">Destaque</Badge>
          </div>
        )}
      </div>

      <div className="flex min-h-60 flex-col p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            {project.category}
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {project.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">
            {project.description}
          </p>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
            <p className="text-xs text-zinc-500">
              Atualizado {project.updatedAt}
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpen(project)}
                aria-label={`Abrir ${project.title}`}
                title="Abrir projeto"
              >
                <ExternalLink size={17} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(project)}
                aria-label={`Editar ${project.title}`}
                title="Editar projeto"
              >
                <Pencil size={17} />
              </Button>

              <Button
                variant="danger"
                size="icon"
                onClick={() => onDelete(project)}
                aria-label={`Excluir ${project.title}`}
                title="Excluir projeto"
              >
                <Trash2 size={17} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
