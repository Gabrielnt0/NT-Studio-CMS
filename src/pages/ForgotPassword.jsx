import { ArrowLeft, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ForgotPassword() {
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wasSent, setWasSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Informe seu e-mail.");
      return;
    }

    setIsSubmitting(true);

    try {
      await requestPasswordReset(email);
      setWasSent(true);
      toast.success("E-mail de recuperação enviado.");
    } catch (error) {
      console.error("Erro ao solicitar recuperação:", error);
      toast.error("Não foi possível enviar o e-mail de recuperação.");
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

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <p className="text-sm font-medium text-blue-400">Recuperação de acesso</p>

          <h1 className="mt-2 text-2xl font-bold text-white">Redefinir senha</h1>

          {wasSent ? (
            <div className="mt-6">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="font-medium text-emerald-300">
                  Verifique sua caixa de entrada
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Enviamos um link de recuperação para <strong>{email}</strong>.
                  Verifique também a pasta de spam.
                </p>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Informe o e-mail da sua conta administrativa para receber o link
                de recuperação.
              </p>

              <form className="mt-6" onSubmit={handleSubmit}>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  E-mail
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seuemail@exemplo.com"
                    required
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-5 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
                </button>
              </form>
            </>
          )}

          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
