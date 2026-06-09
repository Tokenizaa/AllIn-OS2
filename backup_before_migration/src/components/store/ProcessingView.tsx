import { motion } from "framer-motion";

interface ProcessingViewProps {
  sponsorSlug: string;
}

export function ProcessingView({ sponsorSlug }: ProcessingViewProps) {
  return (
    <motion.div 
      key="processing-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto text-center py-20 space-y-4 rounded-3xl border border-zinc-900 bg-[#090d16]"
    >
      <div className="h-12 w-12 rounded-full border-2 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent animate-spin mx-auto" />
      <h3 className="text-sm font-bold text-white">Segurando Gateway de Pagamento All-In...</h3>
      <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
        Liquidanado operação junto aos nós bancários. Atribuindo cashback imediato e alocando pontos binários MLM para @{sponsorSlug} no Ledger.
      </p>
    </motion.div>
  );
}
