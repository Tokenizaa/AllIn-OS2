import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck } from "lucide-react";

interface ReceiptViewProps {
  custName: string;
  custEmail: string;
  sponsorSlug: string;
  onReturnToCatalog: () => void;
}

export function ReceiptView({ custName, custEmail, sponsorSlug, onReturnToCatalog }: ReceiptViewProps) {
  return (
    <motion.div 
      key="receipt-view" 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto border border-emerald-500/30 bg-[#081210]/95 p-8 rounded-3xl shadow-emerald-500/10 shadow-2xl space-y-6"
    >
      <div className="h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 grid place-items-center text-emerald-400 mx-auto">
        <CheckCircle2 className="h-6 w-6" />
      </div>

      <div className="space-y-1.5 text-center">
        <h3 className="text-md font-bold text-white">Transação Faturada com Sucesso!</h3>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
          Olá, <strong className="text-white">{custName}</strong>! Seu pedido foi faturado. Um e-mail de conformidade fiscal e código de rastreio Sedex foi encaminhado para <strong className="text-white">{custEmail}</strong>.
        </p>
      </div>

      <div className="p-4 border border-border/45 rounded-xl bg-background/50 text-[10px] text-muted-foreground font-mono space-y-1.5 text-center select-all">
        <p className="font-sans text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Assinatura Digital de Ledger Criptográfico</p>
        <div className="flex items-center justify-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>BLOCK_HASH: sha256-{Math.random().toString(36).substring(3, 11).toUpperCase()}...</span>
        </div>
        <p className="text-[9px] text-emerald-500">Transação vinculada ao patrocinador @{sponsorSlug}</p>
      </div>

      <button
        onClick={onReturnToCatalog}
        className="w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
      >
        Voltar à Vitrine
      </button>
    </motion.div>
  );
}
