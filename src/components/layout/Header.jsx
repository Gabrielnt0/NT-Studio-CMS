import { Bell, Menu, Search } from "lucide-react";

function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <p className="text-sm text-zinc-500">Painel administrativo</p>
          <h2 className="text-lg font-semibold text-zinc-100">
            NT Studio CMS
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

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
          aria-label="Abrir perfil"
        >
          GI
        </button>
      </div>
    </header>
  );
}

export default Header;