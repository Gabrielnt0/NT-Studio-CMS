import Search from "lucide-react/dist/esm/icons/search";
import Card from "../ui/Card";
import Input from "../ui/Input";

export default function ContentToolbar({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Pesquisar...",
  filters = [],
  selectedFilter,
  onFilterChange,
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <Input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="pl-11"
          />
        </div>

        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const value =
                typeof filter === "string" ? filter : filter.value;
              const label =
                typeof filter === "string" ? filter : filter.label;
              const isActive = selectedFilter === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onFilterChange(value)}
                  className={[
                    "rounded-xl px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "border border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-800 hover:text-white",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
