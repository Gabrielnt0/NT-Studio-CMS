import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function compareValues(left, right, direction) {
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  const bothNumeric = Number.isFinite(leftNumber) && Number.isFinite(rightNumber);

  const result = bothNumeric
    ? leftNumber - rightNumber
    : String(left ?? "").localeCompare(String(right ?? ""), "pt-BR", {
        numeric: true,
        sensitivity: "base",
      });

  return direction === "asc" ? result : -result;
}

export default function AnalyticsTable({
  title,
  description,
  columns,
  rows = [],
  emptyMessage,
  limit,
  searchable = true,
  exportName = "analytics",
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: null, direction: "desc" });

  const filteredRows = useMemo(() => {
    const normalizedRows = Array.isArray(rows) ? rows : [];
    const normalizedQuery = query.trim().toLowerCase();

    const result = normalizedRows.filter(
      (row) =>
        !normalizedQuery ||
        columns.some((column) =>
          String(row?.[column.key] ?? "")
            .toLowerCase()
            .includes(normalizedQuery),
        ),
    );

    if (!sort.key) return result;

    return [...result].sort((left, right) =>
      compareValues(left?.[sort.key], right?.[sort.key], sort.direction),
    );
  }, [columns, query, rows, sort]);

  const visibleRows = limit ? filteredRows.slice(0, limit) : filteredRows;

  const changeSort = (key) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "desc" ? "asc" : "desc",
    }));
  };

  const exportCsv = () => {
    const header = columns.map((column) => csvEscape(column.label)).join(",");
    const lines = filteredRows.map((row) =>
      columns.map((column) => csvEscape(row?.[column.key])).join(","),
    );

    downloadFile(
      `${exportName}.csv`,
      `\uFEFF${[header, ...lines].join("\n")}`,
      "text/csv;charset=utf-8",
    );
  };

  const exportJson = () => {
    downloadFile(
      `${exportName}.json`,
      JSON.stringify(filteredRows, null, 2),
      "application/json;charset=utf-8",
    );
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
      <div className="flex flex-col gap-4 border-b border-zinc-800 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-white">{title}</h2>
            <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-500">
              {filteredRows.length} {filteredRows.length === 1 ? "item" : "itens"}
            </span>
          </div>
          {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          {searchable && (
            <label className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-500 focus-within:border-blue-500/60">
              <Search size={14} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar"
                className="w-36 bg-transparent text-zinc-200 outline-none placeholder:text-zinc-600"
              />
            </label>
          )}

          <button
            type="button"
            onClick={exportCsv}
            disabled={filteredRows.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={14} /> CSV
          </button>

          <button
            type="button"
            onClick={exportJson}
            disabled={filteredRows.length === 0}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            JSON
          </button>
        </div>
      </div>

      {visibleRows.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-zinc-500">
          {query ? "Nenhum resultado para a pesquisa." : emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-zinc-950/60 text-zinc-500">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-5 py-3 font-medium ${column.align === "right" ? "text-right" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => changeSort(column.key)}
                      className={`inline-flex items-center gap-1 transition hover:text-zinc-300 ${column.align === "right" ? "ml-auto" : ""}`}
                    >
                      {column.label}
                      <span className="text-[10px] text-zinc-700">
                        {sort.key === column.key
                          ? sort.direction === "asc"
                            ? "▲"
                            : "▼"
                          : "↕"}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {visibleRows.map((row, index) => (
                <tr
                  key={row?.id ?? `${row?.[columns[0]?.key]}-${index}`}
                  className="border-t border-zinc-800/80 text-zinc-300 transition hover:bg-zinc-800/30"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-5 py-3 ${column.align === "right" ? "text-right font-medium text-zinc-200" : ""}`}
                    >
                      {column.render
                        ? column.render(row?.[column.key], row)
                        : row?.[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
