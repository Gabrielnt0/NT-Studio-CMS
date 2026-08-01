import {
  Database,
  Eye,
  EyeOff,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-blue-500";

export default function MigrationSourceCard({
  source,
  onChange,
  onInspect,
  loading,
  credentialsConfirmed,
  onCredentialsConfirmed,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
          <Database size={20} />
        </div>
        <div>
          <h2 className="font-semibold text-white">
            Supabase antigo
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            As credenciais ficam somente na memória desta página,
            não são salvas e são apagadas após a análise.
          </p>
        </div>
      </div>

      <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-900/50 bg-amber-950/20 p-4 text-sm text-amber-200">
        <ShieldAlert size={19} className="mt-0.5 shrink-0" />
        <p>
          Use somente a <strong>Publishable Key</strong> ou a{" "}
          <strong>anon key</strong> pública. Nunca cole uma chave{" "}
          <strong>service_role</strong> ou <strong>sb_secret</strong>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-zinc-300">
          URL do projeto antigo
          <input
            className={inputClass}
            type="url"
            value={source.url}
            onChange={(event) =>
              onChange("url", event.target.value)
            }
            placeholder="https://xxxx.supabase.co"
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <label className="space-y-2 text-sm text-zinc-300">
          Chave pública antiga
          <input
            className={inputClass}
            type="password"
            value={source.key}
            onChange={(event) =>
              onChange("key", event.target.value)
            }
            placeholder="sb_publishable_... ou anon key"
            autoComplete="new-password"
            spellCheck={false}
          />
        </label>

        <label className="space-y-2 text-sm text-zinc-300">
          E-mail do usuário antigo
          <input
            className={inputClass}
            type="email"
            value={source.email}
            onChange={(event) =>
              onChange("email", event.target.value)
            }
            placeholder="seu@email.com"
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <label className="space-y-2 text-sm text-zinc-300">
          Senha do usuário antigo
          <div className="relative">
            <input
              className={`${inputClass} pr-12`}
              type={showPassword ? "text" : "password"}
              value={source.password}
              onChange={(event) =>
                onChange("password", event.target.value)
              }
              autoComplete="new-password"
              spellCheck={false}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              onClick={() =>
                setShowPassword((value) => !value)
              }
              aria-label="Mostrar ou ocultar senha"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </label>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-300">
        <input
          type="checkbox"
          checked={credentialsConfirmed}
          onChange={(event) =>
            onCredentialsConfirmed(event.target.checked)
          }
          className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-blue-500"
        />
        <span>
          Confirmo que a chave informada é pública e que não estou
          fornecendo uma chave secreta ou service_role.
        </span>
      </label>

      <button
        type="button"
        onClick={onInspect}
        disabled={loading || !credentialsConfirmed}
        className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Analisando..." : "Analisar dados antigos"}
      </button>
    </section>
  );
}
