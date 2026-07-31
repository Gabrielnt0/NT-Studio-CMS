import Search from "lucide-react/dist/esm/icons/search";
import Card from "../ui/Card";

export default function ContentEmptyState({
  icon: Icon = Search,
  title = "Nenhum item encontrado",
  description = "Altere a pesquisa ou os filtros e tente novamente.",
  action,
}) {
  return (
    <Card className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-400">
        <Icon size={24} />
      </div>

      <h3 className="mt-4 font-semibold text-white">{title}</h3>

      <p className="mt-2 max-w-md text-sm text-zinc-500">{description}</p>

      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}
