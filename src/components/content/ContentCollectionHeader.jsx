import Badge from "../ui/Badge";

export default function ContentCollectionHeader({
  title,
  visibleCount,
  totalCount,
  singularLabel,
  pluralLabel,
}) {
  const visibleLabel = visibleCount === 1 ? singularLabel : pluralLabel;
  const totalLabel = totalCount === 1 ? singularLabel : pluralLabel;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-semibold text-white">{title}</h2>

        <p className="mt-1 text-sm text-zinc-500">
          {visibleCount} {visibleLabel} encontrado
          {visibleCount === 1 ? "" : "s"}.
        </p>
      </div>

      <Badge variant="zinc">
        {totalCount} {totalLabel} cadastrado{totalCount === 1 ? "" : "s"}
      </Badge>
    </div>
  );
}
