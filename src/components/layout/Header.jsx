import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

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
            Portfolio CMS
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="hidden text-right xl:block"
          title={user?.email ?? "Administrador"}
        >
          <p className="max-w-52 truncate text-sm font-medium text-zinc-200">
            {user?.email ?? "Administrador"}
          </p>
          <p className="text-xs text-zinc-500">Administrador</p>
        </div>

        <Link
          to="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
          aria-label="Abrir perfil"
          title="Abrir perfil"
        >
          {getInitials(user?.email)}
        </Link>

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
