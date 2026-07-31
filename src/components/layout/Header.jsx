import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

function getInitials(email) {
  if (!email) return "AD";

  const name = email.split("@")[0];
  const parts = name.split(/[._-]/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

function Header({ onOpenMenu }) {
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOut();
      toast.success("Sessão encerrada.");
    } catch (error) {
      console.error("Erro ao sair:", error);
      toast.error("Não foi possível encerrar a sessão.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 backdrop-blur lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm text-zinc-500">Painel administrativo</p>
          <h2 className="truncate text-lg font-semibold text-zinc-100">
            NT Studio Platform
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 md:flex">
          <Search size={17} className="text-zinc-500" />
          <input
            type="search"
            placeholder="Pesquisar..."
            className="w-44 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
          />
        </div>

        <button
          type="button"
          className="relative rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 transition hover:text-white"
          aria-label="Notificações"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
        </button>

        <div className="hidden text-right xl:block" title={user?.email ?? "Administrador"}>
          <p className="max-w-52 truncate text-sm font-medium text-zinc-200">
            {user?.email ?? "Administrador"}
          </p>
          <p className="text-xs text-zinc-500">Administrador</p>
        </div>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
          aria-label="Perfil do administrador"
          title={user?.email ?? "Administrador"}
        >
          {getInitials(user?.email)}
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Sair"
          title="Sair"
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}

export default Header;
