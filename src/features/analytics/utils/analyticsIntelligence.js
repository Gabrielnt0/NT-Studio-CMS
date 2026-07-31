const number = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const percentage = (value) => `${Math.abs(number(value)).toFixed(1).replace(".0", "")}%`;

function average(values = []) {
  const valid = values.map(number).filter(Number.isFinite);
  return valid.length ? valid.reduce((total, value) => total + value, 0) / valid.length : 0;
}

function linearForecast(values = [], steps = 7) {
  const series = values.map(number);
  if (series.length < 2) return Array.from({ length: steps }, () => series.at(-1) ?? 0);

  const n = series.length;
  const xAverage = (n - 1) / 2;
  const yAverage = average(series);
  let numerator = 0;
  let denominator = 0;

  series.forEach((value, index) => {
    numerator += (index - xAverage) * (value - yAverage);
    denominator += (index - xAverage) ** 2;
  });

  const slope = denominator ? numerator / denominator : 0;
  const intercept = yAverage - slope * xAverage;
  return Array.from({ length: steps }, (_, index) => Math.max(0, Math.round(intercept + slope * (n + index))));
}

function detectAnomalies(rows = []) {
  const recent = rows.slice(-30);
  const values = recent.map((row) => number(row.sessions));
  if (values.length < 4) return [];

  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  const deviation = Math.sqrt(variance);
  if (!deviation) return [];

  return recent
    .map((row, index) => {
      const value = values[index];
      const zScore = (value - mean) / deviation;
      if (Math.abs(zScore) < 1.65) return null;
      return {
        date: row.date ?? row.day ?? `Dia ${index + 1}`,
        value,
        direction: zScore > 0 ? "up" : "down",
        severity: Math.abs(zScore) >= 2.4 ? "high" : "medium",
        difference: mean ? ((value - mean) / mean) * 100 : 0,
      };
    })
    .filter(Boolean)
    .slice(-5)
    .reverse();
}

function scoreMetrics(metrics = {}, connected = false) {
  const comparison = metrics.comparison ?? {};
  const sessions = number(metrics.sessions);
  const users = number(metrics.activeUsers ?? metrics.users);
  const views = number(metrics.screenPageViews ?? metrics.views);
  const events = number(metrics.eventCount ?? metrics.events);
  const conversions = number(metrics.conversions ?? metrics.keyEvents);
  const duration = number(metrics.averageSessionDuration);
  const sessionsPerUser = users ? sessions / users : 0;
  const viewsPerSession = sessions ? views / sessions : 0;
  const eventsPerSession = sessions ? events / sessions : 0;
  const conversionRate = sessions ? (conversions / sessions) * 100 : 0;

  const growthValues = [
    comparison.activeUsers,
    comparison.sessions,
    comparison.screenPageViews,
    comparison.eventCount,
  ].map(number);
  const growth = average(growthValues);

  const dimensions = {
    growth: clamp(50 + growth * 1.6),
    engagement: clamp((duration / 180) * 45 + (eventsPerSession / 5) * 35 + (viewsPerSession / 2) * 20),
    conversion: clamp(conversionRate * 18),
    consistency: clamp(100 - detectAnomalies(metrics.daily).filter((item) => item.direction === "down").length * 18),
    data: connected ? (sessions > 0 ? 100 : 65) : 25,
  };

  const total = Math.round(
    dimensions.growth * 0.24 +
    dimensions.engagement * 0.27 +
    dimensions.conversion * 0.2 +
    dimensions.consistency * 0.14 +
    dimensions.data * 0.15,
  );

  return { total: clamp(total), dimensions, growth, sessionsPerUser, viewsPerSession, eventsPerSession, conversionRate };
}

function scoreLabel(score) {
  if (score >= 85) return { label: "Excelente", tone: "emerald" };
  if (score >= 70) return { label: "Saudável", tone: "blue" };
  if (score >= 50) return { label: "Atenção", tone: "amber" };
  return { label: "Crítico", tone: "red" };
}

function buildInsights(metrics, score) {
  const comparison = metrics.comparison ?? {};
  const insights = [];
  const changes = [
    ["activeUsers", "usuários", comparison.activeUsers],
    ["sessions", "sessões", comparison.sessions],
    ["screenPageViews", "visualizações", comparison.screenPageViews],
    ["eventCount", "eventos", comparison.eventCount],
  ];

  changes
    .filter(([, , change]) => Math.abs(number(change)) >= 5)
    .sort((a, b) => Math.abs(number(b[2])) - Math.abs(number(a[2])))
    .slice(0, 2)
    .forEach(([key, label, change]) => {
      const positive = number(change) > 0;
      insights.push({
        id: `change-${key}`,
        type: positive ? "success" : "warning",
        title: `${positive ? "Crescimento" : "Queda"} em ${label}`,
        text: `${label[0].toUpperCase()}${label.slice(1)} ${positive ? "aumentaram" : "diminuíram"} ${percentage(change)} em relação ao período anterior.`,
      });
    });

  const topPage = [...(metrics.topPages ?? [])].sort((a, b) => number(b.views) - number(a.views))[0];
  if (topPage) {
    insights.push({ id: "top-page", type: "info", title: "Conteúdo líder", text: `${topPage.title || topPage.page} concentra o maior volume, com ${number(topPage.views).toLocaleString("pt-BR")} visualizações.` });
  }

  const topSource = [...(metrics.trafficSources ?? [])].sort((a, b) => number(b.sessions) - number(a.sessions))[0];
  if (topSource) {
    insights.push({ id: "top-source", type: "info", title: "Principal aquisição", text: `${topSource.source || "A origem principal"} trouxe ${number(topSource.sessions).toLocaleString("pt-BR")} sessões no período.` });
  }

  if (score.conversionRate > 0) {
    insights.push({ id: "conversion", type: score.conversionRate >= 2 ? "success" : "warning", title: "Eficiência de conversão", text: `A taxa estimada de conversão é ${score.conversionRate.toFixed(2).replace(".", ",")}% das sessões.` });
  }

  return insights.slice(0, 5);
}

function buildRecommendations(metrics, score, anomalies) {
  const recommendations = [];
  if (score.growth < -5) recommendations.push({ priority: "high", title: "Recuperar aquisição", text: "Revise as fontes que perderam sessões e replique campanhas e conteúdos dos períodos de crescimento." });
  if (score.eventsPerSession < 2) recommendations.push({ priority: "medium", title: "Aumentar interação", text: "Inclua chamadas para ação mais visíveis, navegação contextual e eventos nos pontos principais da jornada." });
  if (score.viewsPerSession < 1.5) recommendations.push({ priority: "medium", title: "Melhorar profundidade", text: "Use recomendações de conteúdo relacionado para incentivar uma segunda página por sessão." });
  if (score.conversionRate < 1 && number(metrics.sessions) > 20) recommendations.push({ priority: "high", title: "Otimizar conversões", text: "Simplifique o objetivo principal da página e teste uma chamada para ação única acima da dobra." });
  if (anomalies.some((item) => item.direction === "down")) recommendations.push({ priority: "high", title: "Investigar queda anormal", text: "Compare as datas assinaladas com alterações de conteúdo, campanhas, indisponibilidade e rastreamento." });
  if (!(metrics.topPages ?? []).length) recommendations.push({ priority: "low", title: "Expandir recolha", text: "Sincronize novamente para obter páginas e permitir recomendações de conteúdo mais específicas." });
  if (!recommendations.length) recommendations.push({ priority: "low", title: "Consolidar o crescimento", text: "Mantenha o ritmo atual e transforme os melhores conteúdos em séries, páginas relacionadas e campanhas recorrentes." });
  return recommendations.slice(0, 4);
}

export function createAnalyticsIntelligence(metrics = {}, { connected = false, periodDays = 30 } = {}) {
  const score = scoreMetrics(metrics, connected);
  const status = scoreLabel(score.total);
  const anomalies = detectAnomalies(metrics.daily ?? []);
  const sessionsHistory = (metrics.daily ?? []).map((row) => number(row.sessions));
  const forecast = linearForecast(sessionsHistory, 7);
  const currentAverage = average(sessionsHistory.slice(-7));
  const forecastAverage = average(forecast);
  const forecastChange = currentAverage ? ((forecastAverage - currentAverage) / currentAverage) * 100 : 0;
  const insights = buildInsights(metrics, score);
  const recommendations = buildRecommendations(metrics, score, anomalies);

  const lead = score.growth >= 5
    ? `O desempenho está em expansão, com crescimento médio de ${percentage(score.growth)} nos principais indicadores.`
    : score.growth <= -5
      ? `Os principais indicadores recuaram em média ${percentage(score.growth)} e merecem uma ação de recuperação.`
      : "O desempenho está estável em relação ao período anterior, sem variações amplas nos indicadores principais.";

  return {
    score: { ...score, ...status },
    summary: `${lead} A saúde digital foi classificada como ${status.label.toLowerCase()} (${score.total}/100) na janela de ${periodDays} dias.`,
    insights,
    recommendations,
    anomalies,
    forecast: { values: forecast, change: forecastChange, direction: forecastChange >= 0 ? "up" : "down" },
    generatedAt: new Date().toISOString(),
  };
}
