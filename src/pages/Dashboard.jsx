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
import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";

const statistics = [
  {
    title: "Projetos",
    value: "12",
    description: "Projetos cadastrados",
    icon: BriefcaseBusiness,
    iconClass: "bg-blue-500/10 text-blue-400",
  },
  {
    title: "Habilidades",
    value: "18",
    description: "Competências registradas",
    icon: Wrench,
    iconClass: "bg-violet-500/10 text-violet-400",
  },
  {
    title: "Visualizações",
    value: "14.320",
    description: "Visualizações no portfólio",
    icon: Eye,
    iconClass: "bg-emerald-500/10 text-emerald-400",
  },
  {
    title: "Arquivos",
    value: "42",
    description: "Itens na biblioteca",
    icon: Image,
    iconClass: "bg-amber-500/10 text-amber-400",
  },
];

const recentActivities = [
  {
    id: 1,
    title: "Projeto atualizado",
    description: "NT Studio CMS recebeu novas informações.",
    time: "Há 5 minutos",
    icon: BriefcaseBusiness,
    iconClass: "bg-blue-500/10 text-blue-400",
  },
  {
    id: 2,
    title: "Nova imagem adicionada",
    description: "Uma imagem foi enviada para a biblioteca.",
    time: "Há 2 horas",
    icon: Image,
    iconClass: "bg-violet-500/10 text-violet-400",
  },
  {
    id: 3,
    title: "Perfil editado",
    description: "As informações profissionais foram atualizadas.",
    time: "Ontem",
    icon: UserRound,
    iconClass: "bg-emerald-500/10 text-emerald-400",
  },
];

const recentProjects = [
  {
    id: 1,
    title: "NT Studio CMS",
    category: "Desenvolvimento",
    status: "Em desenvolvimento",
    statusVariant: "blue",
    updatedAt: "Hoje",
  },
  {
    id: 2,
    title: "Portfólio Gabriel",
    category: "Portfólio",
    status: "Publicado",
    statusVariant: "green",
    updatedAt: "Há 2 dias",
  },
  {
    id: 3,
    title: "Affilint",
    category: "Plataforma",
    status: "Planejamento",
    statusVariant: "yellow",
    updatedAt: "Há 5 dias",
  },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-400">
            <Sparkles size={16} />
            <span>NT Studio CMS</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-zinc-400">
            Bem-vindo de volta, Gabriel. Gerencie o conteúdo do seu portfólio.
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map(
          ({ title, value, description, icon: Icon, iconClass }) => (
            <Card key={title} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">{title}</p>

                  <p className="mt-3 text-3xl font-bold text-white">{value}</p>
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
                Últimas alterações realizadas no CMS.
              </p>
            </div>

            <BarChart3 size={20} className="text-zinc-500" />
          </div>

          <div className="divide-y divide-zinc-800">
            {recentActivities.map(
              ({
                id,
                title,
                description,
                time,
                icon: Icon,
                iconClass,
              }) => (
                <article
                  key={id}
                  className="flex items-start gap-4 px-6 py-5 transition hover:bg-zinc-900"
                >
                  <div
                    className={[
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      iconClass,
                    ].join(" ")}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-zinc-100">
                      {title}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">{description}</p>
                  </div>

                  <span className="shrink-0 text-xs text-zinc-600">{time}</span>
                </article>
              ),
            )}
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
              {recentProjects.map(
                ({
                  id,
                  title,
                  category,
                  status,
                  statusVariant,
                  updatedAt,
                }) => (
                  <tr
                    key={id}
                    className="transition hover:bg-zinc-900/70"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-zinc-100">
                        {title}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {category}
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={statusVariant}>{status}</Badge>
                    </td>

                    <td className="px-6 py-4 text-right text-sm text-zinc-500">
                      {updatedAt}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;