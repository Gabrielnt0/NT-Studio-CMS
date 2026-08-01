import { useMemo, useState } from "react";
import {
  downloadBackup,
  exportPortfolioBackup,
  importPortfolioBackup,
  inspectLegacySource,
  migrateLegacyData,
  parseAndValidateBackup,
  SOURCE_TABLES,
} from "../services/migration.service";

const initialSource = { url: "", key: "", email: "", password: "" };
const initialSelection = Object.fromEntries(SOURCE_TABLES.map(({ target }) => [target, true]));
const MAX_BACKUP_FILE_SIZE = 10 * 1024 * 1024;

export default function useMigration() {
  const [source, setSource] = useState(initialSource);
  const [inspection, setInspection] = useState(null);
  const [selection, setSelection] = useState(initialSelection);
  const [pendingBackup, setPendingBackup] = useState(null);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isInspecting, setIsInspecting] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [credentialsConfirmed, setCredentialsConfirmed] = useState(false);

  const totals = useMemo(() => {
    if (!inspection) return { tables: 0, rows: 0, selectedTables: 0, selectedRows: 0 };
    const entries = Object.values(inspection);
    const selectedEntries = entries.filter((entry) => selection[entry.target]);
    return {
      tables: entries.filter((entry) => entry.rows.length > 0).length,
      rows: entries.reduce((total, entry) => total + entry.rows.length, 0),
      selectedTables: selectedEntries.filter((entry) => entry.rows.length > 0).length,
      selectedRows: selectedEntries.reduce((total, entry) => total + entry.rows.length, 0),
    };
  }, [inspection, selection]);

  function resetMessages() {
    setError("");
    setNotice("");
    setResult([]);
    setProgress(null);
  }

  function updateSource(field, value) {
    setSource((current) => ({ ...current, [field]: value }));
  }

  function clearSensitiveSource() {
    setSource((current) => ({
      ...current,
      key: "",
      password: "",
    }));
    setCredentialsConfirmed(false);
  }

  function toggleTable(target) {
    setSelection((current) => ({ ...current, [target]: !current[target] }));
  }

  function selectAll(value) {
    setSelection(Object.fromEntries(SOURCE_TABLES.map(({ target }) => [target, value])));
  }

  async function inspect() {
    if (!credentialsConfirmed) {
      setError(
        "Confirme que está usando apenas uma chave pública antes de continuar.",
      );
      return;
    }

    setIsInspecting(true);
    resetMessages();

    try {
      const nextInspection = await inspectLegacySource(source);
      setInspection(nextInspection);
      setSelection(initialSelection);
      setNotice(
        "Dados antigos analisados. A chave e a senha foram removidas da tela. Revise as tabelas antes de iniciar a migração.",
      );
    } catch (nextError) {
      setInspection(null);
      setError(
        nextError instanceof Error
          ? nextError.message
          : String(nextError),
      );
    } finally {
      clearSensitiveSource();
      setIsInspecting(false);
    }
  }

  async function migrate() {
    if (!inspection || totals.selectedTables === 0) return;
    const confirmed = window.confirm(
      `Migrar ${totals.selectedRows} registros de ${totals.selectedTables} tabelas para o Portfolio CMS atual?`,
    );
    if (!confirmed) return;

    setIsMigrating(true);
    resetMessages();
    try {
      const summary = await migrateLegacyData(inspection, selection, setProgress);
      setResult(summary);
      setNotice("Migração de dados concluída. Confira o resultado abaixo.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : String(nextError));
    } finally {
      setIsMigrating(false);
    }
  }

  async function exportBackup() {
    setIsBackingUp(true);
    resetMessages();
    try {
      const backup = await exportPortfolioBackup();
      downloadBackup(backup);
      setNotice("Backup JSON gerado e enviado para a pasta de downloads.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : String(nextError));
    } finally {
      setIsBackingUp(false);
    }
  }

  async function prepareBackup(file) {
    if (!file) {
      setPendingBackup(null);
      return;
    }

    resetMessages();

    if (file.size > MAX_BACKUP_FILE_SIZE) {
      setPendingBackup(null);
      setError("O arquivo de backup não pode ultrapassar 10 MB.");
      return;
    }

    if (
      file.type &&
      file.type !== "application/json" &&
      !file.name.toLowerCase().endsWith(".json")
    ) {
      setPendingBackup(null);
      setError("Selecione um arquivo JSON criado pelo Portfolio CMS.");
      return;
    }

    try {
      const backup = await parseAndValidateBackup(await file.text());
      setPendingBackup({ fileName: file.name, backup });
      setNotice("Backup validado. Confira o resumo antes de restaurar.");
    } catch (nextError) {
      setPendingBackup(null);
      setError(nextError instanceof Error ? nextError.message : String(nextError));
    }
  }

  async function restoreBackup() {
    if (!pendingBackup) return;
    const rows = Object.values(pendingBackup.backup.data).reduce(
      (total, value) => total + (Array.isArray(value) ? value.length : 0),
      0,
    );
    const confirmed = window.confirm(
      `Restaurar ${rows} registros do arquivo ${pendingBackup.fileName}? Registros com o mesmo ID serão atualizados.`,
    );
    if (!confirmed) return;

    setIsMigrating(true);
    resetMessages();
    try {
      const summary = await importPortfolioBackup(pendingBackup.backup, setProgress);
      setResult(summary);
      setPendingBackup(null);
      setNotice("Backup restaurado com sucesso.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : String(nextError));
    } finally {
      setIsMigrating(false);
    }
  }

  return {
    source,
    inspection,
    selection,
    pendingBackup,
    progress,
    result,
    totals,
    error,
    notice,
    isInspecting,
    isMigrating,
    isBackingUp,
    credentialsConfirmed,
    setCredentialsConfirmed,
    updateSource,
    toggleTable,
    selectAll,
    inspect,
    migrate,
    exportBackup,
    prepareBackup,
    restoreBackup,
  };
}
