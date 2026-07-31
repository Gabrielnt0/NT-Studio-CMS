import EmptyState from "../../../components/ui/EmptyState";
import Loading from "../../../components/ui/Loading";
import PortfolioProjectRow from "./PortfolioProjectRow";

export default function PortfolioProjectTable({
  projects = [],
  isLoading = false,
}) {
  if (isLoading) return <Loading message="Carregando projetos..." />;

  if (!projects.length) {
    return (
      <EmptyState
        title="Nenhum projeto encontrado"
        description="Crie seu primeiro projeto para começar."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="min-w-full">
        <thead className="bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left">Título</th>
            <th className="px-4 py-3 text-left">Categoria</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <PortfolioProjectRow key={project.id} project={project} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
