import { LockKeyhole, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updatePassword(password);
      toast.success("Senha atualizada com sucesso.");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      toast.error("Não foi possível atualizar a senha.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 py-12 text-zinc-100">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Sparkles size={21} />
          </div>

          <div>
            <p className="font-semibold text-white">NT Studio</p>
            <p className="text-sm text-zinc-500">Portfolio CMS</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-2xl shadow-black/20 sm:p-8"
        >
          <p className="text-sm font-medium text-blue-400">Segurança da conta</p>

          <h1 className="mt-2 text-2xl font-bold text-white">Criar nova senha</h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Escolha uma senha forte com pelo menos 8 caracteres.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Nova senha
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                />

                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="passwordConfirmation"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Confirmar nova senha
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                />

                <input
                  id="passwordConfirmation"
                  type="password"
                  autoComplete="new-password"
                  value={passwordConfirmation}
                  onChange={(event) =>
                    setPasswordConfirmation(event.target.value)
                  }
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Atualizando..." : "Atualizar senha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
