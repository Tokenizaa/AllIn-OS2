import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Crown, Eye, EyeOff, Headphones, LogIn, ShieldCheck, Sparkles, Users, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/modules/auth";
import { getDemoRedirectPath, getRoleRedirectPath } from "@/modules/auth/navigation";
import { getTestLoginAccounts, type TestLoginAccount } from "@/modules/auth/test-login";
import { UserRole } from "@/shared/types/roles";

export function LoginView() {
  const navigate = useNavigate();
  const { login, user, activeSponsor } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate({ to: getRoleRedirectPath(user), replace: true });
    }
  }, [navigate, user]);

  const submitLogin = async (nextEmail: string, nextPassword: string, redirectTo?: string) => {
    setLoading(true);
    try {
      const loggedUser = await login(nextEmail, nextPassword);
      toast.success(`Bem-vindo, ${loggedUser.name}!`);
      navigate({ to: redirectTo || getRoleRedirectPath(loggedUser), replace: true });
    } catch (error: any) {
      toast.error(error?.message || "Erro ao efetuar login.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Preencha e-mail e senha.");
      return;
    }
    await submitLogin(email.trim(), password);
  };

  const onQuickLogin = async (account: TestLoginAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    await submitLogin(account.email, account.password, getDemoRedirectPath(account.role));
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="hidden lg:flex flex-col justify-between border-r border-white/10 bg-white/[0.03] p-12">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ffb84d] text-[#111318] font-black">A</div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">AllIn OS</p>
              <p className="text-lg font-semibold">Login leve</p>
            </div>
          </div>

          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-[#ffb84d]" />
              Acesso rapido com perfis de teste
            </span>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight">
              Login simples, sem peso visual e sem perder os atalhos de perfil.
            </h1>
            <p className="max-w-lg text-sm leading-6 text-white/60">
              Entre com sua conta ou use os botoes demo para validar cada area do sistema com um clique.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">Fluxo</p>
                <p className="mt-2 text-sm text-white/80">Autenticacao normal com redirecionamento por role.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">Teste</p>
                <p className="mt-2 text-sm text-white/80">Perfis demo apontando para rotas reais do app.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/45">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Sessao validada pelo Auth atual.
          </div>
        </aside>

        <main className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
          <div className="w-full max-w-xl">
            <div className="mb-6 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ffb84d] text-[#111318] font-black">A</div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/40">AllIn OS</p>
                  <p className="text-sm text-white/75">Login</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0b1019]/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.35em] text-white/35">Acesso</p>
                <h2 className="text-3xl font-semibold tracking-tight">Entrar na plataforma</h2>
                <p className="text-sm text-white/55">Use e-mail e senha ou escolha um perfil demo.</p>
              </div>

              {activeSponsor && (
                <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                  Referencia ativa: <span className="font-semibold">@{activeSponsor}</span>
                </div>
              )}

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-[0.25em] text-white/40">E-mail</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-amber-500/40"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-xs font-medium uppercase tracking-[0.25em] text-white/40">Senha</label>
                    <Link to="/recuperar-senha" className="text-xs text-[#ffb84d] hover:text-[#ffd56b] hover:underline">
                      Esqueceu?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="h-11 rounded-xl border-white/10 bg-white/5 pr-11 text-white placeholder:text-white/30 focus-visible:ring-amber-500/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 right-3 grid place-items-center text-white/45 hover:text-white"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl bg-[#ffb84d] font-semibold text-[#111318] shadow-lg shadow-orange-500/20 hover:bg-[#ffd56b]"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#111318]/30 border-t-[#111318]" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Entrar
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[11px] uppercase tracking-[0.3em] text-white/35">Perfis de teste</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {getTestLoginAccounts().map((account) => {
                  const icon =
                    account.role === UserRole.ADMIN_MASTER || account.role === UserRole.GESTAO_ADMIN ? <Crown className="h-4 w-4 text-amber-300" /> :
                    account.role === UserRole.FINANCEIRO ? <Wallet className="h-4 w-4 text-sky-300" /> :
                    account.role === UserRole.SUPORTE ? <Headphones className="h-4 w-4 text-cyan-300" /> :
                    <Users className="h-4 w-4 text-fuchsia-300" />;

                  return (
                    <Button
                      key={account.email}
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={() => onQuickLogin(account)}
                      className="h-auto min-h-12 justify-start gap-3 rounded-xl border-white/10 bg-white/5 px-4 py-3 text-left text-white hover:bg-white/10 hover:text-white"
                    >
                      {icon}
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">{account.label}</span>
                        <span className="truncate text-[11px] text-white/35">{getDemoRedirectPath(account.role)}</span>
                      </span>
                    </Button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                <p className="text-sm text-white/55">
                  Ainda nao tem conta?{" "}
                  <Link to="/seja-distribuidor" className="font-medium text-[#ffb84d] hover:text-[#ffd56b] hover:underline">
                    Seja um distribuidor
                  </Link>
                </p>
                <p className="text-xs text-white/35">Acesso preparado para desktop e mobile.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
