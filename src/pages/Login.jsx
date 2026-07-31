import { LockKeyhole, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const { signIn, isAuthenticated, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const destination = location.state?.from?.pathname ?? "/";

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      toast.error("Preencha o e-mail e a senha.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(formData);
      toast.success("Login realizado com sucesso.");
      navigate(destination, { replace: true });
    } catch (error) {
      console.error("Erro ao entrar:", error);

      if (error?.message === "Invalid login credentials") {
        toast.error("E-mail ou senha incorretos.");
      } else if (error?.message === "Email not confirmed") {
        toast.error("Confirme seu e-mail antes de entrar.");
      } else {
        toast.error("Não foi possível entrar. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isAuthLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="grid min-h-screen bg-zinc-950 text-zinc-100 lg:grid-cols-2">
      <section className="hidden border-r border-zinc-800 bg-zinc-900/40 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Sparkles size={22} />
          </div>

          <div>
            <p className="font-semibold text-white">NT Studio</p>
            <p className="text-sm text-zinc-500">Portfolio CMS</p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Painel administrativo
          </p>

          <h1 className="mt-5 text-4xl font-bold leading-tight text-white">
            Gerencie todo o seu portfólio em um único lugar.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-zinc-400">
            Projetos, mídia, experiências, habilidades, SEO e configurações
            protegidos por autenticação segura.
          </p>
        </div>

        <p className="text-sm text-zinc-600">
          © {new Date().getFullYear()} NT Studio CMS
        </p>
      </section>

      <main className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Sparkles size={20} />
            </div>

            <div>
              <p className="font-semibold text-white">NT Studio</p>
              <p className="text-xs text-zinc-500">Portfolio CMS</p>
            </div>
          </div>

          <p className="text-sm font-medium text-blue-400">Acesso administrativo</p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Entrar no painel
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Utilize a conta administrativa cadastrada no Supabase.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
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
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seuemail@exemplo.com"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-300"
                >
                  Senha
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                />

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Digite sua senha"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;
