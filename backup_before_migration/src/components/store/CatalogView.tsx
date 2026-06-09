import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { CartDrawer } from "./CartDrawer";

interface CatalogViewProps {
  products: any[];
  cart: { product: any; quantity: number }[];
  coupon: string;
  discount: number;
  subtotal: number;
  deliveryCost: number;
  finalTotal: number;
  sponsorSlug: string;
  onAddToCart: (prod: any) => void;
  onRemoveFromCart: (prodId: string) => void;
  onUpdateQty: (prodId: string, delta: number) => void;
  onApplyCoupon: () => void;
  onSetCoupon: (value: string) => void;
  onStartCheckout: () => void;
  formatBRL: (value: string) => string;
  onViewDetails: (prod: any) => void;
}

export function CatalogView({
  products,
  cart,
  coupon,
  discount,
  subtotal,
  deliveryCost,
  finalTotal,
  sponsorSlug,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQty,
  onApplyCoupon,
  onSetCoupon,
  onStartCheckout,
  formatBRL,
  onViewDetails,
}: CatalogViewProps) {
  return (
    <motion.div 
      key="catalog-view" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-12"
    >
      {/* BRAND IMAGE BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-indigo-950/20 via-zinc-900/40 to-transparent p-6 sm:p-10">
        <div className="absolute top-0 right-0 h-96 w-96 bg-gradient-to-b from-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="relative max-w-2xl space-y-4">
          <span className="text-[10px] font-bold tracking-widest font-mono text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-full uppercase">
            PRODUTOS HOMOLOGADOS COM PATENTE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-snug">
            Ciência Bioativa Aplicada à Longevidade Saudável
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Explore suplementos que operam na modulação de radicais livres, suporte mitocondrial avançado e reversão estética. Compre direto da rede All-In com suporte garantido de @{sponsorSlug}.
          </p>
        </div>
      </div>

      {/* PRODUCT CATALOG GRID */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-emerald-400" /> Vitrina de Compras
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
              formatBRL={formatBRL}
            />
          ))}
        </div>
      </div>

      {/* INTERACTIVE CART DRAWER IN PAGE */}
      <CartDrawer
        cart={cart}
        products={products}
        coupon={coupon}
        discount={discount}
        subtotal={subtotal}
        deliveryCost={deliveryCost}
        finalTotal={finalTotal}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
        onUpdateQty={onUpdateQty}
        onApplyCoupon={onApplyCoupon}
        onSetCoupon={onSetCoupon}
        onStartCheckout={onStartCheckout}
        formatBRL={formatBRL}
      />
    </motion.div>
  );
}
