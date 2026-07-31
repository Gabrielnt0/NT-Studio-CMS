function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
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

function createSummaryRows(metrics) {
  return [
    ["Usuários", metrics.activeUsers ?? 0],
    ["Sessões", metrics.sessions ?? 0],
    ["Visualizações", metrics.screenPageViews ?? 0],
    ["Eventos", metrics.eventCount ?? 0],
    ["Duração média", metrics.averageSessionDurationFormatted ?? "0m 00s"],
  ];
}

export default function AnalyticsReportActions({ metrics = {}, projectName = "projeto", periodDays = 30 }) {
  const safeName = String(projectName || "projeto").toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");

  const exportCsv = () => {
    const rows = createSummaryRows(metrics);
    const content = ["Métrica,Valor", ...rows.map((row) => row.map(csvEscape).join(","))].join("\n");
    downloadFile(`analytics-${safeName}-${periodDays}-dias.csv`, `\uFEFF${content}`, "text/csv;charset=utf-8");
  };

  const exportJson = () => {
    downloadFile(
      `analytics-${safeName}-${periodDays}-dias.json`,
      JSON.stringify({ project: projectName, periodDays, exportedAt: new Date().toISOString(), metrics }, null, 2),
      "application/json;charset=utf-8",
    );
  };

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button type="button" onClick={exportCsv} className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-white">Exportar CSV</button>
      <button type="button" onClick={exportJson} className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-white">Exportar JSON</button>
      <button type="button" onClick={() => window.print()} className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-white">Imprimir relatório</button>
    </div>
  );
}
