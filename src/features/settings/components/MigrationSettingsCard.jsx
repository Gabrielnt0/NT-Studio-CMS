import { ArrowRight, DatabaseBackup } from "lucide-react";
import { Link } from "react-router-dom";

export default function MigrationSettingsCard() {
  return <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400"><DatabaseBackup size={21} /></div>
        <div>
          <h2 className="font-semibold text-white">Migração e backup</h2>
          <p className="mt-1 max-w-2xl text-sm text-zinc-400">Transfira os dados do Supabase antigo, exporte backups JSON e restaure o conteúdo do portfólio.</p>
        </div>
      </div>
      <Link to="/settings/migration" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-violet-500 hover:text-violet-300">
        Abrir ferramenta <ArrowRight size={17} />
      </Link>
    </div>
  </section>;
}
