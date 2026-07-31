function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function exportAnalyticsCsv({ metrics, projectName, periodDays }) {
  const rows = [
    ["Relatório", projectName || "Projeto"],
    ["Período", `${periodDays} dias`],
    ["Gerado em", new Date().toLocaleString("pt-BR")],
    [],
    ["Métrica", "Valor"],
    ["Usuários ativos", metrics.activeUsers || 0],
    ["Sessões", metrics.sessions || 0],
    ["Visualizações", metrics.screenPageViews || 0],
    ["Eventos", metrics.eventCount || 0],
    ["Taxa de engajamento", metrics.engagementRate || 0],
    ["Conversões", metrics.conversions || metrics.keyEvents || 0],
    [],
    ["Página", "Visualizações", "Usuários"],
    ...(metrics.topPages || []).map((row) => [row.title || row.page, row.views || 0, row.activeUsers || 0]),
  ];
  const csv = `\ufeff${rows.map((row) => row.map(escapeCsv).join(";")).join("\n")}`;
  downloadBlob(csv, `analytics-${periodDays}-dias.csv`, "text/csv;charset=utf-8");
}

export function printAnalyticsReport({ metrics, projectName, periodDays, branding }) {
  const popup = window.open("", "_blank", "noopener,noreferrer");
  if (!popup) throw new Error("Permita pop-ups para gerar o relatório em PDF.");
  const title = branding.reportTitle || "Relatório de Analytics";
  const cards = [
    ["Usuários ativos", metrics.activeUsers || 0],
    ["Sessões", metrics.sessions || 0],
    ["Visualizações", metrics.screenPageViews || 0],
    ["Eventos", metrics.eventCount || 0],
    ["Engajamento", `${Number(metrics.engagementRate || 0).toFixed(1)}%`],
    ["Conversões", metrics.conversions || metrics.keyEvents || 0],
  ];
  popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>
    body{font-family:Arial,sans-serif;color:#18181b;padding:40px}h1{margin:0 0 8px}.muted{color:#71717a}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:28px 0}.card{border:1px solid #e4e4e7;border-radius:12px;padding:18px}.value{font-size:28px;font-weight:700;margin-top:8px}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{text-align:left;border-bottom:1px solid #e4e4e7;padding:10px 6px}footer{margin-top:32px;color:#71717a;font-size:12px}@media print{button{display:none}}
  </style></head><body><h1>${title}</h1><p class="muted">${branding.companyName || ""} · ${projectName || "Projeto"} · últimos ${periodDays} dias</p><div class="grid">${cards.map(([label, value]) => `<div class="card"><div class="muted">${label}</div><div class="value">${value}</div></div>`).join("")}</div><h2>Páginas com melhor desempenho</h2><table><thead><tr><th>Página</th><th>Visualizações</th><th>Usuários</th></tr></thead><tbody>${(metrics.topPages || []).slice(0, 10).map((row) => `<tr><td>${row.title || row.page || "—"}</td><td>${row.views || 0}</td><td>${row.activeUsers || 0}</td></tr>`).join("")}</tbody></table>${branding.showPoweredBy ? "<footer>Relatório gerado pelo NT Studio CMS.</footer>" : ""}<script>window.onload=()=>window.print();</script></body></html>`);
  popup.document.close();
}
