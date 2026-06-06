import { ShoppingBag, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartDrawerProps {
  cart: { product: any; quantity: number }[];
  products: any[];
  coupon: string;
  discount: number;
  subtotal: number;
  deliveryCost: number;
  finalTotal: number;
  onAddToCart: (prod: any) => void;
  onRemoveFromCart: (prodId: string) => void;
  onUpdateQty: (prodId: string, delta: number) => void;
  onApplyCoupon: () => void;
  onSetCoupon: (value: string) => void;
  onStartCheckout: () => void;
  formatBRL: (value: string) => string;
}

export function CartDrawer({
  cart,
  products,
  coupon,
  discount,
  subtotal,
  deliveryCost,
  finalTotal,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQty,
  onApplyCoupon,
  onSetCoupon,
  onStartCheckout,
  formatBRL,
}: CartDrawerProps) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-[#090d16]/85 p-6 md:p-8 grid md:grid-cols-12 gap-8 scroll-mt-24">
      <div className="md:col-span-7 space-y-4">
        <h3 className="text-md font-bold text-white flex items-center gap-2">
          <ShoppingBag className="h-4.5 w-4.5 text-emerald-400" /> Seu Carrinho de Compras
        </h3>

        {cart.length === 0 ? (
          <div className="text-center py-12 space-y-3 border border-dashed border-border/40 rounded-2xl bg-background/20">
            <p className="text-sm text-zinc-500">Seu carrinho está vazio.</p>
            <button 
              onClick={() => onAddToCart(products[0])}
              className="h-8 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold cursor-pointer"
            >
              Começar com Vita Complex
            </button>
          </div>
        ) : (
          <div className="space-y-3.5 divide-y divide-border/25">
            {cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 items-center pt-3.5 first:pt-0">
                <img
                  src={item.product.id === "prd_1" ? "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=100" :
                       item.product.id === "prd_2" ? "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=100" :
                       "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=100"}
                  alt={item.product.name}
                  className="h-12 w-12 rounded-lg object-cover bg-zinc-800"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                  <p className="text-[10px] text-emerald-400 font-mono">+{item.product.bonus_payment_percentage || 20} Pontos MLM por unidade</p>
                </div>
                
                <div className="flex items-center gap-1 bg-[#06080d] border border-border/80 rounded-lg p-0.5">
                  <button onClick={() => onUpdateQty(item.product.id, -1)} className="h-6 w-6 rounded-md hover:bg-background/80 flex items-center justify-center shrink-0 text-zinc-400 hover:text-white cursor-pointer"><Minus className="h-3 w-3" /></button>
                  <span className="text-xs font-bold font-mono px-2 w-6 text-center">{item.quantity}</span>
                  <button onClick={() => onUpdateQty(item.product.id, 1)} className="h-6 w-6 rounded-md hover:bg-background/80 flex items-center justify-center shrink-0 text-zinc-400 hover:text-white cursor-pointer"><Plus className="h-3 w-3" /></button>
                </div>

                <div className="text-right pl-2">
                  <p className="text-xs font-bold text-white">{formatBRL(String(parseFloat(item.product.price) * item.quantity))}</p>
                  <button onClick={() => onRemoveFromCart(item.product.id)} className="text-[10px] text-rose-400 hover:underline inline-flex items-center gap-0.5 mt-0.5 cursor-pointer">
                    <Trash2 className="h-3 w-3" /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="md:col-span-1 border-r border-border/10 hidden md:block" />

      <div className="md:col-span-4 space-y-4">
        <div className="p-3 bg-background/50 rounded-xl border border-border/30 text-center">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">Resumo Financeiro</p>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest block font-mono">Cupom Cadastrado</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={coupon}
              onChange={(e) => onSetCoupon(e.target.value)}
              placeholder="ALLIN10"
              className="flex-1 h-8 rounded-lg bg-[#06080d] border border-border px-3 text-xs uppercase font-mono"
            />
            <button
              onClick={onApplyCoupon}
              className="h-8 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 text-xs font-bold cursor-pointer font-mono"
            >
              Aplicar
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-background/50 border border-border/30 space-y-2 text-xs font-mono">
          <div className="flex justify-between text-zinc-400">
            <span>Subtotal:</span>
            <span className="text-white">{formatBRL(String(subtotal))}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-rose-400">
              <span>Desconto ALLIN10 (-10%):</span>
              <span>-{formatBRL(String(discount))}</span>
            </div>
          )}
          <div className="flex justify-between text-zinc-400">
            <span>Frete Internacional (Sedex):</span>
            <span className="text-white">{deliveryCost === 0 ? "Grátis" : formatBRL(String(deliveryCost))}</span>
          </div>
          <div className="border-t border-zinc-800 pt-3 flex justify-between font-bold text-sm">
            <span className="text-white font-sans font-bold">Total Geral:</span>
            <span className="text-emerald-400 font-extrabold">{formatBRL(String(finalTotal))}</span>
          </div>
        </div>

        <button
          onClick={onStartCheckout}
          className="w-full h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider h-11 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 pt-0.5 cursor-pointer"
        >
          Seguir para Pagamento
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
