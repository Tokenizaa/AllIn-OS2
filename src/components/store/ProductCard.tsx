import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: any;
  onAddToCart: (prod: any) => void;
  onViewDetails: (prod: any) => void;
  formatBRL: (value: string) => string;
}

export function ProductCard({ product, onAddToCart, onViewDetails, formatBRL }: ProductCardProps) {
  return (
    <div className="rounded-2xl border border-border/45 bg-[#090d16]/95 overflow-hidden flex flex-col justify-between hover:border-zinc-700 hover:scale-[1.01] transition-all p-1">
      <div className="relative">
        <img
          src={product.imgSrc}
          alt={product.caption}
          className="w-full h-48 object-cover rounded-xl"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          <span className="text-[8px] font-bold font-mono text-emerald-400 bg-background/90 px-2 py-0.5 rounded-md border border-emerald-500/25 uppercase">
            {product.categorias}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white line-clamp-1 leading-snug">{product.caption}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1">{product.caption2}</p>
        </div>

        <div className="space-y-3 pt-3 border-t border-border/20">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-muted-foreground font-mono">Valor Comercial:</span>
            <strong className="text-md font-bold text-white">{formatBRL(product.price)}</strong>
          </div>

          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => onViewDetails(product)}
              className="col-span-2 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
            >
              Saiba Mais
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="col-span-3 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer pt-0.5"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
