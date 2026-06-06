import { AnimatePresence, motion } from "framer-motion";

interface ProductDetailsDialogProps {
  product: any;
  onClose: () => void;
  onAddToCart: (prod: any) => void;
  formatBRL: (value: string) => string;
}

export function ProductDetailsDialog({ product, onClose, onAddToCart, formatBRL }: ProductDetailsDialogProps) {
  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border border-zinc-800 bg-[#090d16] p-6 max-w-md w-full space-y-5"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-500/20">{product.category}</span>
                <h3 className="text-md font-bold text-white mt-1.5">{product.name}</h3>
              </div>
              <button 
                onClick={onClose}
                className="text-xs text-zinc-400 hover:text-white font-mono bg-[#06080d] px-2 py-0.5 rounded-md cursor-pointer border border-border/30"
              >
                Fechar
              </button>
            </div>

            <img 
              src={product.id === "prd_1" ? "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=300" :
                   product.id === "prd_2" ? "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=300" :
                   "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=300"}
              alt={product.name}
              className="w-full h-36 object-cover rounded-xl"
            />

            <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
              <p>{product.description}</p>
              <div className="p-3 bg-background border border-border/40 rounded-xl grid grid-cols-2 gap-2 text-center text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground font-mono">Fabricante</p>
                  <p className="font-semibold text-white">{product.manufacturer}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-mono">Pontos MLM</p>
                  <p className="font-semibold text-emerald-400 font-mono">+{product.bonus_payment_percentage || 20} pts</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-zinc-800">
              <strong className="text-md text-white font-bold">{formatBRL(product.price)}</strong>
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="h-9 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold flex items-center justify-center cursor-pointer"
              >
                Adicionar no Carrinho
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
