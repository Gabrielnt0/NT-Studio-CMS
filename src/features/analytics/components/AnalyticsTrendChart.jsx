import { useId, useMemo, useState } from "react";

const METRICS = [
  { key: "activeUsers", label: "Usuários", color: "rgb(96 165 250)" },
  { key: "sessions", label: "Sessões", color: "rgb(52 211 153)" },
  { key: "screenPageViews", label: "Visualizações", color: "rgb(167 139 250)" },
  { key: "eventCount", label: "Eventos", color: "rgb(251 191 36)" },
];

const numberFormatter = new Intl.NumberFormat("pt-BR");

function formatDate(value, long = false) {
  if (!value) return "";
  const normalized = String(value).replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
  const date = new Date(`${normalized}T12:00:00`);

  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat(
    "pt-BR",
    long
      ? { day: "2-digit", month: "long", year: "numeric" }
      : { day: "2-digit", month: "short" },
  ).format(date);
}

function createSmoothPath(points = []) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    const previous = points[index - 1];
    const controlX = previous.x + (point.x - previous.x) / 2;
    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, "");
}

function ComparisonBadge({ value }) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return null;

  const isPositive = numericValue > 0;
  const isNegative = numericValue < 0;
  const classes = isPositive
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
    : isNegative
      ? "border-red-500/20 bg-red-500/10 text-red-300"
      : "border-zinc-700 bg-zinc-800/70 text-zinc-400";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {isPositive ? "▲" : isNegative ? "▼" : "•"} {Math.abs(numericValue).toFixed(1)}%
    </span>
  );
}

export default function AnalyticsTrendChart({
  rows = [],
  comparison = {},
  title = "Evolução do período",
}) {
  const [metric, setMetric] = useState("activeUsers");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const gradientId = useId().replace(/:/g, "");
  const safeRows = Array.isArray(rows) ? rows : [];
  const selected = METRICS.find((item) => item.key === metric) ?? METRICS[0];
  const width = 960;
  const height = 320;
  const paddingX = 38;
  const paddingTop = 24;
  const paddingBottom = 34;

  const chart = useMemo(() => {
    const values = safeRows.map((row) => Math.max(0, Number(row?.[metric] ?? 0)));
    const max = Math.max(...values, 1);
    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingTop - paddingBottom;
    const points = safeRows.map((row, index) => ({
      x: paddingX + (safeRows.length <= 1 ? usableWidth / 2 : (index / (safeRows.length - 1)) * usableWidth),
      y: paddingTop + usableHeight - (Math.max(0, Number(row?.[metric] ?? 0)) / max) * usableHeight,
      row,
    }));
    const path = createSmoothPath(points);
    const areaPath = points.length
      ? `${path} L ${points.at(-1).x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
      : "";
    const total = values.reduce((sum, value) => sum + value, 0);
    const average = values.length ? total / values.length : 0;
    const peak = values.length ? Math.max(...values) : 0;
    const peakIndex = values.indexOf(peak);

    return { values, max, points, path, areaPath, total, average, peak, peakIndex, usableHeight };
  }, [metric, safeRows]);

  const hoveredPoint = hoveredIndex !== null ? chart.points[hoveredIndex] : null;
  const tooltipLeft = hoveredPoint ? `${(hoveredPoint.x / width) * 100}%` : "50%";

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-xl shadow-black/10">
      <div className="border-b border-zinc-800 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-semibold text-white">{title}</h2>
              <ComparisonBadge value={comparison?.[metric]} />
            </div>
            <p className="mt-1 text-sm text-zinc-500">Passe o cursor sobre o gráfico para consultar cada dia.</p>
          </div>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Métrica do gráfico">
            {METRICS.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={metric === item.key}
                onClick={() => {
                  setMetric(item.key);
                  setHoveredIndex(null);
                }}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  metric === item.key
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                    : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-b border-zinc-800 bg-zinc-800 sm:grid-cols-4">
        <div className="bg-zinc-950/70 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">Total</p>
          <strong className="mt-1 block text-xl text-white">{numberFormatter.format(chart.total)}</strong>
        </div>
        <div className="bg-zinc-950/70 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">Média diária</p>
          <strong className="mt-1 block text-xl text-white">{numberFormatter.format(Math.round(chart.average))}</strong>
        </div>
        <div className="bg-zinc-950/70 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">Pico</p>
          <strong className="mt-1 block text-xl text-white">{numberFormatter.format(chart.peak)}</strong>
        </div>
        <div className="bg-zinc-950/70 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">Dias analisados</p>
          <strong className="mt-1 block text-xl text-white">{safeRows.length}</strong>
        </div>
      </div>

      <div className="p-5">
        {safeRows.length === 0 ? (
          <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-zinc-800 text-sm text-zinc-500">
            Sincronize as métricas para gerar o gráfico.
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl bg-zinc-950/35 px-2 pt-3">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-72 w-full select-none"
              role="img"
              aria-label={`Gráfico de ${selected.label}`}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={selected.color} stopOpacity="0.34" />
                  <stop offset="100%" stopColor={selected.color} stopOpacity="0" />
                </linearGradient>
              </defs>

              {[0, 1, 2, 3, 4].map((line) => {
                const y = paddingTop + (line / 4) * chart.usableHeight;
                return (
                  <line
                    key={line}
                    x1={paddingX}
                    x2={width - paddingX}
                    y1={y}
                    y2={y}
                    stroke="rgb(63 63 70)"
                    strokeOpacity="0.42"
                    strokeDasharray="4 7"
                  />
                );
              })}

              <path d={chart.areaPath} fill={`url(#${gradientId})`} />
              <path
                d={chart.path}
                fill="none"
                stroke={selected.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chart.points.map((point, index) => (
                <g
                  key={`${point.row?.date ?? "day"}-${index}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onFocus={() => setHoveredIndex(index)}
                >
                  <circle cx={point.x} cy={point.y} r="15" fill="transparent" />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={hoveredIndex === index || chart.peakIndex === index ? 5.5 : 3.5}
                    fill="rgb(9 9 11)"
                    stroke={selected.color}
                    strokeWidth="3"
                  />
                </g>
              ))}

              {hoveredPoint && (
                <line
                  x1={hoveredPoint.x}
                  x2={hoveredPoint.x}
                  y1={paddingTop}
                  y2={height - paddingBottom}
                  stroke={selected.color}
                  strokeOpacity="0.45"
                  strokeDasharray="4 5"
                />
              )}
            </svg>

            {hoveredPoint && (
              <div
                className="pointer-events-none absolute top-3 z-10 -translate-x-1/2 rounded-xl border border-zinc-700 bg-zinc-950/95 px-4 py-3 shadow-2xl"
                style={{ left: tooltipLeft }}
              >
                <p className="whitespace-nowrap text-xs text-zinc-500">{formatDate(hoveredPoint.row?.date, true)}</p>
                <p className="mt-1 whitespace-nowrap text-sm font-semibold text-white">
                  {selected.label}: {numberFormatter.format(Number(hoveredPoint.row?.[metric] ?? 0))}
                </p>
              </div>
            )}

            <div className="flex justify-between px-2 pb-3 text-xs text-zinc-600">
              <span>{formatDate(safeRows[0]?.date)}</span>
              <span>{formatDate(safeRows.at(-1)?.date)}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
