import { motion } from "framer-motion";
import { ShieldCheck, Crown, ArrowRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface RegistrationSuccessProps {
  name: string;
  sponsorSlug: string;
}

export function RegistrationSuccess({ name, sponsorSlug }: RegistrationSuccessProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      key="success-step" 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 md:p-12 text-center space-y-6 bg-gradient-to-b from-[#081210]/95 to-background text-zinc-300 relative rounded-3xl"
    >
      <div className="h-14 w-14 rounded-full bg-emerald-500/15 border border-emerald-500/25 grid place-items-center text-emerald-400 mx-auto">
        <ShieldCheck className="h-7 w-7" />
      </div>

      <div className="space-y-1.5 max-w-lg mx-auto">
        <h3 className="text-lg font-black text-white">Credenciamento Homologado!</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Seu perfil operacional de distribuidor foi inserido na plataforma All-In Life. Todas as suas comissões e as do seu sponsor <strong className="text-white">@{sponsorSlug}</strong> já estão vinculadas ao seu ledger.
        </p>
      </div>

      <div className="p-4 border border-emerald-500/15 rounded-xl bg-emerald-500/5 text-[10px] text-muted-foreground font-mono space-y-1.5 max-w-sm mx-auto">
        <p className="text-left font-sans text-[9px] uppercase tracking-wider text-muted-foreground mb-1 text-center">Assinatura Certificada</p>
        <div className="flex items-center justify-center gap-1">
          <Crown className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>SPONSOR_ID: {sponsorSlug.toUpperCase()}</span>
        </div>
        <p className="text-[9px] text-emerald-500">Credenciados: {name}</p>
      </div>

      <button
        onClick={() => {
          navigate({ to: "/distributor/plan" });
        }}
        className="inline-flex h-11 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold uppercase tracking-wider items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 pt-0.5 cursor-pointer"
      >
        Entrar no Escritório & Ativar Licença
        <ArrowRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
