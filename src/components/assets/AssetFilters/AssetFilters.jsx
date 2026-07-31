export default function AssetFilters({
  value = "all",
  onChange,
  options = [],
  label = "Filtrar arquivos",
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
      <span className="sr-only">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm text-zinc-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:min-w-44"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
