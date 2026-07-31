import StatusBadge from "../../../components/ui/StatusBadge";

export default function PortfolioProjectRow({ project }) {
  const variant =
    project.status === "Publicado"
      ? "success"
      : project.status === "Rascunho"
      ? "warning"
      : "default";

  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-900/50">
      <td className="px-4 py-3 font-medium text-white">{project.title}</td>
      <td className="px-4 py-3 text-zinc-400">{project.category}</td>
      <td className="px-4 py-3">
        <StatusBadge variant={variant}>{project.status}</StatusBadge>
      </td>
      <td className="px-4 py-3 text-right">
        <button className="rounded bg-zinc-800 px-3 py-1 text-sm hover:bg-zinc-700">
          Editar
        </button>
      </td>
    </tr>
  );
}
