import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Landmark, Crown } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface RegistrationFormProps {
  distName: string;
  sponsorSlug: string;
  distRank: string;
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  cpf: string;
  setCpf: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  submittingReg: boolean;
  handleRegisterSubmit: (e: React.FormEvent) => void;
}

export function RegistrationForm({
  distName,
  sponsorSlug,
  distRank,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  cpf,
  setCpf,
  password,
  setPassword,
  selectedPlan,
  setSelectedPlan,
  submittingReg,
  handleRegisterSubmit,
}: RegistrationFormProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      key="form-step" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid md:grid-cols-12"
    >
      {/* Profile side */}
      <div className="md:col-span-5 bg-gradient-to-br from-[#0d172e] via-[#090e1b] to-[#04060b] p-6 md:p-8 flex flex-col justify-between border-r border-[#141f39]">
        <div className="space-y-4">
          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-500/25">
            PATROCÍNIO VINCULADO
          </span>
          <h3 className="text-md font-bold text-white">Você Está se Credenciando Conosco</h3>
          
          <div className="flex items-center gap-3 bg-black/40 border border-border/40 rounded-xl p-3">
            <img 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(distName)}`} 
              alt={distName} 
              className="h-10 w-10 rounded-full border border-emerald-500/40 object-cover" 
            />
            <div>
              <p className="font-bold text-white text-xs">{distName}</p>
              <p className="text-[10px] text-emerald-400 font-mono leading-none mt-0.5">@{sponsorSlug}</p>
              <p className="text-[10px] text-zinc-400 mt-1">{distRank}</p>
            </div>
          </div>

          <p className="text-zinc-400 leading-relaxed text-xs">
            Seu patrocinador legítimo assegura sua vaga de nível superior na perna binária ativa. Seus bônus serão depositados semanalmente direto em conta bancária auditada pela administração.
          </p>
        </div>

        <div className="pt-6 border-t border-zinc-800 text-[10px] text-zinc-500 space-y-1">
          <p className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Tecnologia de segurança com gateway Bacen</p>
          <p className="flex items-center gap-1.5"><Landmark className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Liquidação imediata de bônus binários</p>
        </div>
      </div>

      {/* Form fields */}
      <form onSubmit={handleRegisterSubmit} className="md:col-span-7 p-6 md:p-10 space-y-5">
        <h3 className="text-md font-bold text-white mb-2 leading-none">Preencha Seu Credenciamento Oficial</h3>
        
        <div className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Seu Nome Completo</label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
              placeholder="Ex: Nome Completo"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">E-mail para Licença</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Senha de Acesso ao Painel</label>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">CPF para Auditoria Receita</label>
              <input 
                type="text" required value={cpf} onChange={(e) => setCpf(e.target.value)}
                className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                placeholder="111.222.333-44"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">WhatsApp de Contato</label>
              <input 
                type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                placeholder="(11) 98765-4321"
              />
            </div>
          </div>

          {/* Choose startup plan option */}
          <div className="space-y-1.5 pt-2">
            <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Franquia / Kit de Adesão Inicial</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button" onClick={() => setSelectedPlan("starter")}
                className={`p-2.5 text-left rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                  selectedPlan === "starter" ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:bg-background/25"
                }`}
              >
                <span className="text-[10px] font-bold text-zinc-400">Starter</span>
                <span className="text-xs font-black text-white font-mono mt-1">R$ 199</span>
              </button>
              <button
                type="button" onClick={() => setSelectedPlan("pro")}
                className={`p-2.5 text-left rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                  selectedPlan === "pro" ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:bg-background/25"
                }`}
              >
                <span className="text-[10px] font-bold text-emerald-400">Diamond Pro</span>
                <span className="text-xs font-black text-white font-mono mt-1">R$ 499</span>
              </button>
              <button
                type="button" onClick={() => setSelectedPlan("platinum")}
                className={`p-2.5 text-left rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                  selectedPlan === "platinum" ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:bg-background/25"
                }`}
              >
                <span className="text-[10px] font-bold text-zinc-400">Supreme PK</span>
                <span className="text-xs font-black text-white font-mono mt-1">R$ 1.290</span>
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submittingReg}
          className="w-full h-11 h-10 mt-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer pt-0.5"
        >
          {submittingReg ? (
            <span className="h-4 w-4 animate-spin rounded-full border border-t-transparent border-black" />
          ) : (
            <>
              Confirmar Credenciamento e Obter Link
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
