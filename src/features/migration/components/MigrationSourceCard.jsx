import { Database, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const inputClass = "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-blue-500";

export default function MigrationSourceCard({ source, onChange, onInspect, loading }) {
  const [showPassword, setShowPassword] = useState(false);

  return <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
    <div className="mb-5 flex items-start gap-3">
      <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400"><Database size={20} /></div>
      <div>
        <h2 className="font-semibold text-white">Supabase antigo</h2>
        <p className="mt-1 text-sm text-zinc-400">As credenciais são usadas somente nesta sessão do navegador e não são salvas.</p>
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <label className="space-y-2 text-sm text-zinc-300">URL do projeto antigo
        <input className={inputClass} value={source.url} onChange={(event) => onChange("url", event.target.value)} placeholder="https://xxxx.supabase.co" />
      </label>
      <label className="space-y-2 text-sm text-zinc-300">Chave pública antiga
        <input className={inputClass} value={source.key} onChange={(event) => onChange("key", event.target.value)} placeholder="sb_publishable_... ou anon key" />
      </label>
      <label className="space-y-2 text-sm text-zinc-300">E-mail do usuário antigo
        <input className={inputClass} type="email" value={source.email} onChange={(event) => onChange("email", event.target.value)} placeholder="seu@email.com" />
      </label>
      <label className="space-y-2 text-sm text-zinc-300">Senha do usuário antigo
        <div className="relative">
          <input className={`${inputClass} pr-12`} type={showPassword ? "text" : "password"} value={source.password} onChange={(event) => onChange("password", event.target.value)} />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white" onClick={() => setShowPassword((value) => !value)} aria-label="Mostrar ou ocultar senha">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </label>
    </div>

    <button type="button" onClick={onInspect} disabled={loading} className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60">
      {loading ? "Analisando..." : "Analisar dados antigos"}
    </button>
  </section>;
}
