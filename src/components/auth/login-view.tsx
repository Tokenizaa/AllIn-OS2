import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LogIn, ShieldCheck, Sparkles, Network, TrendingUp, Building2, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TestAccountsFill } from "@/components/auth/test-accounts-fill";
import { useAuth } from "@/modules/auth";
import { useReferralTrackingQuery } from "@/hooks/referral/useReferralTrackingQuery";
import { DashboardResolver } from "@/modules/auth/services/dashboardResolver.service";
import { getNetworkErrorMessage } from "@/lib/network-resilience";

export function LoginView() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const referralQuery = useReferralTrackingQuery();
  const activeSponsor = (referralQuery as any).data?.activeSponsor;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (user) {
      navigate({ to: DashboardResolver.getDashboardPathForUser(user), replace: true });
    }
  }, [navigate, user]);

  const submitLogin = async (nextEmail: string, nextPassword: string) => {
    setLoading(true);
    try {
      const loggedUser = await login(nextEmail, nextPassword);
      toast.success(`Bem-vindo de volta, ${loggedUser.name}!`);
      navigate({ to: DashboardResolver.getDashboardPathForUser(loggedUser), replace: true });
    } catch (error: any) {
      console.error("[LoginView] Login error:", error);
      
      // Use network-aware error message
      const errorMessage = getNetworkErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFillTestAccount = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Preencha e-mail e senha.");
      return;
    }
    await submitLogin(email.trim(), password);
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
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Sistema de Gestão de Rede
            </span>
            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              Construa sua rede de distribuição com inteligência
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-slate-300">
              Acesse sua conta para gerenciar sua rede de distribuidores, acompanhar comissões, e expandir seu negócio de venda direta com ferramentas profissionais.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5 backdrop-blur-sm">
                <Network className="h-6 w-6 text-primary mb-3" />
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Rede de Distribuidores</p>
                <p className="text-sm text-slate-300">Gerencie sua rede binária e unilevel com visualização completa.</p>
              </div>
              <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5 backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-emerald-400 mb-3" />
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Comissões em Tempo Real</p>
                <p className="text-sm text-slate-300">Acompanhe seus ganhos e bônus com relatórios detalhados.</p>
              </div>
              <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5 backdrop-blur-sm">
                <Building2 className="h-6 w-6 text-fuchsia-400 mb-3" />
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Escritório Virtual</p>
                <p className="text-sm text-slate-300">Ferramentas completas para gerenciar seu negócio de qualquer lugar.</p>
              </div>
              <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5 backdrop-blur-sm">
                <Users className="h-6 w-6 text-cyan-400 mb-3" />
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Venda Direta</p>
                <p className="text-sm text-slate-300">Loja virtual integrada para maximizar suas vendas.</p>
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

            <div className="rounded-[28px] border border-slate-800/50 bg-slate-900/50 backdrop-blur-xl p-6 shadow-2xl shadow-black/30 sm:p-8">
              <div className="space-y-3 mb-8">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Acesso à Plataforma</p>
                <h2 className="text-3xl font-bold tracking-tight text-white">Entre na sua conta</h2>
                <p className="text-sm text-slate-400">
                  Acesse seu painel de distribuidor e gerencie sua rede de negócios
                </p>
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

              {isDevelopment && (
                <>
                  <div className="mt-7 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-700/50" />
                    <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Ambiente de Desenvolvimento</span>
                    <div className="h-px flex-1 bg-slate-700/50" />
                  </div>

                  <div className="mt-5">
                    <TestAccountsFill 
                      onFillFields={handleFillTestAccount}
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              <div className="mt-6 pt-6 border-t border-slate-800/50 text-center">
                <p className="text-sm text-slate-400">
                  Ainda não tem conta?{" "}
                  <Link to="/cadastro" className="font-semibold text-primary hover:text-primary/80 hover:underline">
                    Cadastre-se como distribuidor
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
