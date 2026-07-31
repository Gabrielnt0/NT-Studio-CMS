function buildRecommendations(metrics = {}, connected = false) {
  const recommendations = [];
  const sessions = Number(metrics.sessions ?? 0);
  const users = Number(metrics.activeUsers ?? 0);
  const views = Number(metrics.screenPageViews ?? 0);
  const duration = Number(metrics.averageSessionDuration ?? 0);
  const sources = Array.isArray(metrics.trafficSources) ? metrics.trafficSources : [];
  const pages = Array.isArray(metrics.topPages) ? metrics.topPages : [];
  const comparison = metrics.comparison ?? {};

  if (!connected) recommendations.push({ level: "high", title: "Validar a ligação", text: "Teste novamente a integração do Google Analytics para garantir que os dados estão disponíveis." });
  if (connected && sessions === 0) recommendations.push({ level: "high", title: "Confirmar recolha de dados", text: "Não existem sessões no período. Verifique o Measurement ID e se o site está a receber visitas." });
  if (sessions > 0 && views / sessions < 1.2) recommendations.push({ level: "medium", title: "Melhorar navegação interna", text: "As visualizações por sessão estão baixas. Adicione ligações internas e chamadas para outros conteúdos." });
  if (duration > 0 && duration < 45) recommendations.push({ level: "medium", title: "Aumentar retenção", text: "A duração média está abaixo de 45 segundos. Reforce a introdução e a clareza das páginas principais." });
  if (sources.length < 3 && sessions > 0) recommendations.push({ level: "medium", title: "Diversificar aquisição", text: "O tráfego depende de poucas origens. Considere SEO, redes sociais e referências externas." });
  if (Number(comparison.sessions ?? 0) < -10) recommendations.push({ level: "high", title: "Investigar queda de sessões", text: "As sessões caíram mais de 10% face ao período anterior. Reveja campanhas, SEO e alterações recentes." });
  if (pages.length > 0) recommendations.push({ level: "low", title: "Aproveitar a página líder", text: `Use “${pages[0]?.title || pages[0]?.page || "a página mais vista"}” para encaminhar visitantes para conteúdos estratégicos.` });
  if (users > 0 && recommendations.length === 0) recommendations.push({ level: "low", title: "Desempenho estável", text: "Os indicadores principais estão saudáveis. Continue a acompanhar tendências e conteúdos com maior crescimento." });

  return recommendations.slice(0, 4);
}

const styles = {
  high: "border-red-500/20 bg-red-500/5 text-red-300",
  medium: "border-amber-500/20 bg-amber-500/5 text-amber-300",
  low: "border-blue-500/20 bg-blue-500/5 text-blue-300",
};

export default function AnalyticsRecommendations({ metrics = {}, connected = false }) {
  const recommendations = buildRecommendations(metrics, connected);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Próximas ações</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Recomendações automáticas</h2>
        <p className="mt-1 text-sm text-zinc-400">Sugestões geradas a partir das métricas do período selecionado.</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {recommendations.map((item) => (
          <article key={`${item.title}-${item.text}`} className={`rounded-xl border p-4 ${styles[item.level]}`}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-current/10 text-sm font-bold">!</span>
              <div>
                <h3 className="font-semibold text-zinc-100">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-400">{item.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
