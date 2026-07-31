import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Image,
  LayoutDashboard,
  Palette,
  Search,
  Settings,
  Sparkles,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Portfólio", path: "/portfolio", icon: BriefcaseBusiness },
  { label: "Mídia", path: "/media", icon: Image },
  { label: "Perfil", path: "/profile", icon: UserRound },
  { label: "Experiências", path: "/experiences", icon: FileText },
  { label: "Formação", path: "/education", icon: GraduationCap },
  { label: "Habilidades", path: "/skills", icon: Wrench },
  { label: "SEO", path: "/seo", icon: Search },
  { label: "Aparência", path: "/appearance", icon: Palette },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
];

function SidebarContent({ onNavigate, onClose }) {
  return (
    <>
      <div className="flex h-20 items-center justify-between gap-3 border-b border-zinc-800 px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Sparkles size={20} />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-zinc-100">Portfolio CMS</p>
            <p className="truncate text-xs text-zinc-500">Painel pessoal</p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        )}
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
                end={path === "/"}
                onClick={onNavigate}
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
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              isActive
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
            ].join(" ")
          }
        >
          <Settings size={18} />
          <span>Configurações</span>
        </NavLink>
      </div>
    </>
  );
}

function Sidebar({ isMobileOpen = false, onMobileClose }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-zinc-800 bg-zinc-950 lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onMobileClose}
            aria-label="Fechar menu"
          />

          <aside className="relative z-10 flex h-full w-[min(18rem,85vw)] flex-col border-r border-zinc-800 bg-zinc-950 shadow-2xl">
            <SidebarContent
              onNavigate={onMobileClose}
              onClose={onMobileClose}
            />
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;
