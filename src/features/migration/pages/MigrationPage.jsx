import { Download, FileUp, ShieldCheck, TriangleAlert } from "lucide-react";
import ContentPageHeader from "../../../components/content/ContentPageHeader";
import BackupPreview from "../components/BackupPreview";
import MigrationProgress from "../components/MigrationProgress";
import MigrationResult from "../components/MigrationResult";
import MigrationSourceCard from "../components/MigrationSourceCard";
import MigrationTable from "../components/MigrationTable";
import useMigration from "../hooks/useMigration";

export default function MigrationPage() {
  const migration = useMigration();

  return <div className="space-y-6">
    <ContentPageHeader eyebrow="Ferramentas" title="Migração e backup" description="Transfira os dados do Supabase antigo ou crie uma cópia de segurança completa do seu portfólio." />

    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <Download className="text-blue-400" size={22} />
        <h2 className="mt-4 font-semibold text-white">Exportar backup</h2>
        <p className="mt-2 text-sm text-zinc-400">Baixe um JSON com os dados atualmente armazenados no Portfolio CMS.</p>
        <button type="button" onClick={migration.exportBackup} disabled={migration.isBackingUp} className="mt-5 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-blue-500 hover:text-blue-300 disabled:opacity-60">
          {migration.isBackingUp ? "Gerando..." : "Baixar backup JSON"}
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <FileUp className="text-violet-400" size={22} />
        <h2 className="mt-4 font-semibold text-white">Restaurar backup</h2>
        <p className="mt-2 text-sm text-zinc-400">Valide e restaure um backup JSON criado pelo Portfolio CMS.</p>
        <label className="mt-5 inline-flex cursor-pointer rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-violet-500 hover:text-violet-300">
          Escolher arquivo
          <input type="file" accept="application/json,.json" className="hidden" onChange={(event) => { migration.prepareBackup(event.target.files?.[0]); event.target.value = ""; }} />
        </label>
      </div>
    </section>

    <BackupPreview pendingBackup={migration.pendingBackup} loading={migration.isMigrating} onRestore={migration.restoreBackup} onCancel={() => migration.prepareBackup(null)} />

    <div className="rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-4 text-sm text-emerald-200">
      <div className="flex items-start gap-3"><ShieldCheck size={19} className="mt-0.5 shrink-0" /><p>A migração preserva os IDs dos projetos e slides, troca o usuário antigo pelo usuário autenticado e remove referências a workspace.</p></div>
    </div>
    <div className="rounded-2xl border border-amber-900/50 bg-amber-950/20 p-4 text-sm text-amber-200">
      <div className="flex items-start gap-3"><TriangleAlert size={19} className="mt-0.5 shrink-0" /><p>Esta etapa migra registros do banco. Arquivos físicos do Storage não são copiados automaticamente; URLs antigas continuarão funcionando enquanto o projeto antigo permanecer ativo.</p></div>
    </div>

    <MigrationSourceCard source={migration.source} onChange={migration.updateSource} onInspect={migration.inspect} loading={migration.isInspecting} />

    {migration.error && <div className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">{migration.error}</div>}
    {migration.notice && <div className="rounded-xl border border-blue-900/60 bg-blue-950/30 px-4 py-3 text-sm text-blue-200">{migration.notice}</div>}

    {migration.inspection && <>
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:flex-row sm:items-center">
        <div><p className="font-semibold text-white">Pronto para migrar</p><p className="mt-1 text-sm text-zinc-400">Selecionados: {migration.totals.selectedRows} registros em {migration.totals.selectedTables} tabelas com conteúdo.</p></div>
        <button type="button" onClick={migration.migrate} disabled={migration.isMigrating || migration.totals.selectedTables === 0} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60">{migration.isMigrating ? "Migrando..." : "Migrar selecionadas"}</button>
      </div>
      <MigrationTable inspection={migration.inspection} selection={migration.selection} onToggle={migration.toggleTable} onSelectAll={migration.selectAll} />
    </>}

    <MigrationProgress progress={migration.progress} />
    <MigrationResult result={migration.result} />
  </div>;
}
