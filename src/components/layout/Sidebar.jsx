import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Image,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Projetos",
    path: "/projects",
    icon: BriefcaseBusiness,
  },
  {
    label: "Mídia",
    path: "/media",
    icon: Image,
  },
  {
    label: "Perfil",
    path: "/profile",
    icon: UserRound,
  },
  {
    label: "Experiências",
    path: "/experiences",
    icon: FileText,
  },
  {
    label: "Formação",
    path: "/education",
    icon: GraduationCap,
  },
  {
    label: "Habilidades",
    path: "/skills",
    icon: Wrench,
  },
  {
    label: "SEO",
    path: "/seo",
    icon: Search,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
];

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-zinc-800 bg-zinc-950 lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-zinc-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Sparkles size={20} />
        </div>

        <div>
          <p className="font-semibold text-zinc-100">NT Studio</p>
          <p className="text-xs text-zinc-500">Portfolio CMS</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">
          Gerenciamento
        </p>

        <ul className="space-y-1">
          {navigationItems.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
                  ].join(" ")
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
        >
          <Settings size={18} />
          <span>Configurações</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;