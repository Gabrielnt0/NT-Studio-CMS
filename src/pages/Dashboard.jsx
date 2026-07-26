function Dashboard() {
  return (
    <section className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
      <div className="mx-auto max-w-6xl">
        <span className="text-sm font-medium text-blue-400">
          NT Studio CMS
        </span>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">Dashboard</h1>

        <p className="mt-3 text-zinc-400">
          Bem-vindo ao painel de gerenciamento do seu portfólio.
        </p>

        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold">Tailwind CSS configurado</h2>

          <p className="mt-2 text-sm text-zinc-400">
            A estrutura visual do NT Studio CMS está pronta para começar.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;