export default function AssetGrid({
  children,
  className = "",
  columns = "default",
}) {
  const columnClasses = {
    compact:
      "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
    default:
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    large:
      "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  };

  const selectedColumns =
    columnClasses[columns] || columnClasses.default;

  return (
    <div
      className={`grid gap-5 ${selectedColumns} ${className}`}
    >
      {children}
    </div>
  );
}
