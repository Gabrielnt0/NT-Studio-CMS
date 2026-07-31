import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Eye,
  Image,
  Plus,
  Settings,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import { getDashboardOverview } from "../features/dashboard/services/dashboard.service";

const NUMBER_FORMATTER = new Intl.NumberFormat("pt-BR");

const activityPresentation = {
  project: {
    icon: BriefcaseBusiness,
    iconClass: "bg-blue-500/10 text-blue-400",
  },
  media: {
    icon: Image,
    iconClass: "bg-violet-500/10 text-violet-400",
  },
  profile: {
    icon: UserRound,
    iconClass: "bg-emerald-500/10 text-emerald-400",
  },
};

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setOverview(await getDashboardOverview());
    } catch (requestError) {
      console.error("Erro ao carregar o dashboard:", requestError);
      setError(requestError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const statistics = useMemo(
    () => [
      {
        title: "Projetos",
        value: NUMBER_FORMATTER.format(overview?.statistics.projects ?? 0),
        description: "Projetos cadastrados",
        icon: BriefcaseBusiness,
        iconClass: "bg-blue-500/10 text-blue-400",
      },
      {
        title: "Habilidades",
        value: NUMBER_FORMATTER.format(overview?.statistics.skills ?? 0),
        description: "Competências registradas",
        icon: Wrench,
        iconClass: "bg-violet-500/10 text-violet-400",
      },
      {
        title: "Visualizações",
        value: overview?.formattedViews ?? "0",
        description: "Última leitura do Analytics",
        icon: Eye,
        iconClass: "bg-emerald-500/10 text-emerald-400",
      },
      {
        title: "Arquivos",
        value: NUMBER_FORMATTER.format(overview?.statistics.media ?? 0),
        description: "Itens na biblioteca",
        icon: Image,
        iconClass: "bg-amber-500/10 text-amber-400",
      },
    ],
    [overview],
  );

  const recentProjects = overview?.recentProjects ?? [];
  const recentActivities = overview?.recentActivities ?? [];

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-400">
            <Sparkles size={16} />
            <span>Portfolio CMS</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-zinc-400">
            Bem-vindo de volta, {overview?.ownerName ?? "Administrador"}. Gerencie
            o conteúdo real do seu portfólio.
          </p>
        </div>

        <Link
          to="/portfolio"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <Plus size={18} />
          Novo projeto
        </Link>
      </section>

      {error && (
        <Card className="border-red-500/30 bg-red-500/5 p-5">
          <p className="font-medium text-red-300">
            Não foi possível carregar os dados do Dashboard.
          </p>
          <p className="mt-1 text-sm text-red-300/70">
            {error.message || "Confira a conexão e as permissões do Supabase."}
          </p>
          <button
            type="button"
            onClick={loadDashboard}
            className="mt-4 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
          >
            Tentar novamente
          </button>
        </Card>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map(
          ({ title, value, description, icon: Icon, iconClass }) => (
            <Card key={title} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">{title}</p>
                  <p className="mt-3 text-3xl font-bold text-white">
                    {isLoading ? "—" : value}
                  </p>
                </div>

                <div
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    iconClass,
                  ].join(" ")}
                >
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-4 text-sm text-zinc-500">{description}</p>
            </Card>
          ),
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
            <div>
              <h2 className="font-semibold text-white">Atividades recentes</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Alterações identificadas nos seus dados.
              </p>
            </div>

            <BarChart3 size={20} className="text-zinc-500" />
          </div>

          <div className="divide-y divide-zinc-800">
            {!isLoading && recentActivities.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-zinc-500">
                Nenhuma atividade recente encontrada.
              </div>
            )}

            {recentActivities.map((activity) => {
              const presentation =
                activityPresentation[activity.type] ??
                activityPresentation.project;
              const Icon = presentation.icon;

              return (
                <article
                  key={activity.id}
                  className="flex items-start gap-4 px-6 py-5 transition hover:bg-zinc-900"
                >
                  <div
                    className={[
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      presentation.iconClass,
                    ].join(" ")}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-zinc-100">
                      {activity.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {activity.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-zinc-600">
                    {activity.time}
                  </span>
                </article>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="border-b border-zinc-800 px-6 py-5">
            <h2 className="font-semibold text-white">Ações rápidas</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Acesse as principais ferramentas.
            </p>
          </div>

          <div className="space-y-3 p-5">
            <Link
              to="/portfolio"
              className="group flex items-center gap-4 rounded-xl border border-zinc-800 p-4 transition hover:border-blue-500/50 hover:bg-blue-500/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <BriefcaseBusiness size={19} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-100">
                  Adicionar projeto
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Cadastre um novo trabalho.
                </p>
              </div>
              <ArrowRight
                size={18}
                className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-blue-400"
              />
            </Link>

            <Link
              to="/media"
              className="group flex items-center gap-4 rounded-xl border border-zinc-800 p-4 transition hover:border-violet-500/50 hover:bg-violet-500/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Image size={19} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-100">
                  Enviar arquivos
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Gerencie imagens e vídeos.
                </p>
              </div>
              <ArrowRight
                size={18}
                className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-violet-400"
              />
            </Link>

            <Link
              to="/settings"
              className="group flex items-center gap-4 rounded-xl border border-zinc-800 p-4 transition hover:border-zinc-600 hover:bg-zinc-800/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300">
                <Settings size={19} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-100">
                  Configurações
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Ajuste as opções do sistema.
                </p>
              </div>
              <ArrowRight
                size={18}
                className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-zinc-300"
              />
            </Link>
          </div>
        </Card>
      </section>

      <Card>
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <div>
            <h2 className="font-semibold text-white">Projetos recentes</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Trabalhos adicionados ou atualizados recentemente.
            </p>
          </div>

          <Link
            to="/portfolio"
            className="flex items-center gap-1 text-sm font-medium text-blue-400 transition hover:text-blue-300"
          >
            Ver todos
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead>
              <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-600">
                <th className="px-6 py-4 font-medium">Projeto</th>
                <th className="px-6 py-4 font-medium">Categoria</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">
                  Atualização
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800">
              {!isLoading && recentProjects.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-zinc-500"
                  >
                    Nenhum projeto cadastrado no novo Supabase.
                  </td>
                </tr>
              )}

              {recentProjects.map((project) => (
                <tr
                  key={project.id}
                  className="transition hover:bg-zinc-900/70"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-zinc-100">
                      {project.title}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {project.category}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={project.statusVariant}>
                      {project.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-zinc-500">
                    {project.updatedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
