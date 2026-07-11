import { useState, useEffect } from "react";
import { createFileRoute, Link, useParams, useLoaderData } from "@tanstack/react-router";
import { resolveDistributor } from "@/hooks/distributor/useDistributorQuery";
import { useProductsQuery } from "@/hooks/products/useProductsQuery";
import { AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { PublicHeader } from "@/components/app/public-header";
import { formatBRL } from "@/lib/customer-calculations";
import { useStoreCart } from "@/hooks/store/useStoreCart";
import { useStoreCheckout } from "@/hooks/store/useStoreCheckout";
import { CatalogView } from "@/components/store/CatalogView";
import { CheckoutView } from "@/components/store/CheckoutView";
import { ProcessingView } from "@/components/store/ProcessingView";
import { ReceiptView } from "@/components/store/ReceiptView";
import { ProductDetailsDialog } from "@/components/store/ProductDetailsDialog";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/loja/$slug")({
  component: DistributorStorePage,
  // Sprint 3: Implementar loader para carregar dados antes da renderização
  loader: async ({ params }) => {
    const slug = params.slug?.toLowerCase().trim();
    if (!slug) {
      return { distributor: null };
    }
    const distributor = await resolveDistributor(slug);
    return { distributor };
  },
});

export function DistributorStorePage() {
  const params = useParams({ strict: false }) as { slug?: string };
  const routeSlug = params.slug?.toLowerCase().trim();
  const { products } = useProductsQuery();

  // Sprint 3: Usar loader para dados pré-carregados
  const { distributor: currentDistributor } = useLoaderData({ from: "/loja/$slug" });

  const sponsorSlug = currentDistributor?.slug || "";
  const distName = currentDistributor?.name || "Distribuidor";
  const distRank = currentDistributor?.rank || "";
  const distAvatar = currentDistributor?.avatar || "";

  const { cart, addToCart, removeFromCart, updateQty, clearCart, subtotal } = useStoreCart(routeSlug);
  
  const deliveryCost = subtotal > 300 || subtotal === 0 ? 0 : 25.00;
  
  const [selectedProductDetails, setSelectedProductDetails] = useState<any>(null);
  const [checkoutStep, setCheckoutStep] = useState<"catalog" | "checkout" | "processing" | "receipt">("catalog");

  const {
    coupon,
    setCoupon,
    discount,
    setDiscount,
    custName,
    setCustName,
    custEmail,
    setCustEmail,
    custPhone,
    setCustPhone,
    custCPF,
    setCustCPF,
    deliveryType,
    setDeliveryType,
    payMethod,
    setPayMethod,
    cardNumber,
    setCardNumber,
    cardExpiry,
    setCardExpiry,
    cardCVC,
    setCardCVC,
    applyCouponHandler,
    startCheckout,
    handlePurchaseSubmit,
    handleReturnToCatalog,
  } = useStoreCheckout({
    cart,
    subtotal,
    discount: 0,
    deliveryCost,
    finalTotal: Math.max(0, subtotal - 0 + deliveryCost),
    sponsorSlug,
    clearCart,
    setCheckoutStep: setCheckoutStep as any,
  });

  const finalTotal = Math.max(0, subtotal - discount + deliveryCost);

  return (
    <div className="min-h-screen bg-[#06080d] text-white selection:bg-emerald-500/30 overflow-x-hidden">
      {/* SPONSOR DECK PIN BAR */}
      <div className="bg-gradient-to-r from-[#0d1627] to-[#070b13] border-b border-border/10 px-4 py-2.5 text-center flex flex-wrap items-center justify-center gap-2 text-xs relative z-40">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <p className="text-zinc-300 font-sans">
          Você está navegando na loja virtual oficial de 
          <strong className="text-white hover:underline cursor-pointer"> {distName}</strong>
        </p>
        <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono leading-none py-0.5 uppercase">
          {distRank}
        </Badge>
        <Link 
          to="/$slug" 
          params={{ slug: sponsorSlug }} 
          className="text-emerald-400 hover:text-emerald-300 ml-1.5 underline inline-flex items-center gap-0.5"
        >
          Consultar Perfil <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* HEADER NAVBAR */}
      <PublicHeader />

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 relative">
        <AnimatePresence mode="wait">
          {checkoutStep === "catalog" && (
            <CatalogView
              products={products}
              cart={cart}
              coupon={coupon}
              discount={discount}
              subtotal={subtotal}
              deliveryCost={deliveryCost}
              finalTotal={finalTotal}
              sponsorSlug={sponsorSlug}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              onUpdateQty={updateQty}
              onApplyCoupon={applyCouponHandler}
              onSetCoupon={setCoupon}
              onStartCheckout={startCheckout}
              formatBRL={formatBRL}
              onViewDetails={setSelectedProductDetails}
            />
          )}

          {checkoutStep === "checkout" && (
            <CheckoutView
              cart={cart}
              custName={custName}
              custEmail={custEmail}
              custPhone={custPhone}
              custCPF={custCPF}
              deliveryType={deliveryType}
              payMethod={payMethod}
              cardNumber={cardNumber}
              cardExpiry={cardExpiry}
              cardCVC={cardCVC}
              discount={discount}
              subtotal={subtotal}
              deliveryCost={deliveryCost}
              finalTotal={finalTotal}
              sponsorSlug={sponsorSlug}
              distName={distName}
              distAvatar={distAvatar}
              onSetCustName={setCustName}
              onSetCustEmail={setCustEmail}
              onSetCustPhone={setCustPhone}
              onSetCustCPF={setCustCPF}
              onSetDeliveryType={setDeliveryType}
              onSetPayMethod={setPayMethod}
              onSetCardNumber={setCardNumber}
              onSetCardExpiry={setCardExpiry}
              onSetCardCVC={setCardCVC}
              onSubmit={handlePurchaseSubmit}
              onBack={() => setCheckoutStep("catalog")}
              formatBRL={formatBRL}
            />
          )}

          {checkoutStep === "processing" && (
            <ProcessingView sponsorSlug={sponsorSlug} />
          )}

          {checkoutStep === "receipt" && (
            <ReceiptView
              custName={custName}
              custEmail={custEmail}
              sponsorSlug={sponsorSlug}
              onReturnToCatalog={handleReturnToCatalog}
            />
          )}
        </AnimatePresence>

        {/* DETAILS/ABOUT PRODUCT DIALOG (OVERLAY) */}
        <ProductDetailsDialog
          product={selectedProductDetails}
          onClose={() => setSelectedProductDetails(null)}
          onAddToCart={addToCart}
          formatBRL={formatBRL}
        />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#040609] py-12 relative z-10 text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="font-semibold text-white uppercase tracking-widest text-[11px]">All-In Life · Loja Autorizada de {distName}</p>
          <p className="max-w-md mx-auto leading-relaxed">
            Plataforma de varejo integrada à estrutura da All-In Brasil. Suas transações faturam cashback direto e volume de perna de rede em conformidade com as diretivas MLM oficiais.
          </p>
          <p className="text-[10px]">Patrocinador: <span className="text-zinc-400 font-mono">@{sponsorSlug}</span> · ID: <span className="text-zinc-400 font-mono">{currentDistributor?.slug || "dist_001"}</span></p>
        </div>
      </footer>
    </div>
  );
}
