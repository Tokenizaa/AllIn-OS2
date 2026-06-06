import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, QrCode, CreditCard } from "lucide-react";

interface CheckoutViewProps {
  cart: { product: any; quantity: number }[];
  custName: string;
  custEmail: string;
  custPhone: string;
  custCPF: string;
  deliveryType: string;
  payMethod: "pix" | "card";
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
  discount: number;
  subtotal: number;
  deliveryCost: number;
  finalTotal: number;
  sponsorSlug: string;
  distName: string;
  distAvatar: string;
  onSetCustName: (value: string) => void;
  onSetCustEmail: (value: string) => void;
  onSetCustPhone: (value: string) => void;
  onSetCustCPF: (value: string) => void;
  onSetDeliveryType: (value: string) => void;
  onSetPayMethod: (method: "pix" | "card") => void;
  onSetCardNumber: (value: string) => void;
  onSetCardExpiry: (value: string) => void;
  onSetCardCVC: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  formatBRL: (value: string) => string;
}

export function CheckoutView({
  cart,
  custName,
  custEmail,
  custPhone,
  custCPF,
  deliveryType,
  payMethod,
  cardNumber,
  cardExpiry,
  cardCVC,
  discount,
  subtotal,
  deliveryCost,
  finalTotal,
  sponsorSlug,
  distName,
  distAvatar,
  onSetCustName,
  onSetCustEmail,
  onSetCustPhone,
  onSetCustCPF,
  onSetDeliveryType,
  onSetPayMethod,
  onSetCardNumber,
  onSetCardExpiry,
  onSetCardCVC,
  onSubmit,
  onBack,
  formatBRL,
}: CheckoutViewProps) {
  return (
    <motion.div 
      key="checkout-view" 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-[#090d16] p-6 md:p-10 shadow-2xl space-y-8"
    >
      <div className="flex justify-between items-center border-b border-border/20 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white leading-tight">Checkout do Consumidor Final</h2>
          <p className="text-xs text-zinc-400 mt-1">Inscreva seus dados para calcular entrega e processar cashback de rede All-In.</p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline cursor-pointer font-mono"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar à loja
        </button>
      </div>

      <form onSubmit={onSubmit} className="grid md:grid-cols-12 gap-8">
        {/* Billing inputs */}
        <div className="md:col-span-7 space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#a855f7] bg-purple-500/15 border border-purple-500/20 px-2 rounded-md py-0.5 inline-block">1. Dados Governamentais & Cobrança</h3>
          
          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Nome Completo do Destinatário</label>
              <input
                type="text" required value={custName} onChange={(e) => onSetCustName(e.target.value)}
                placeholder="Ex: Carlos Heitor"
                className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">E-mail para Nota Fiscal</label>
                <input
                  type="email" required value={custEmail} onChange={(e) => onSetCustEmail(e.target.value)}
                  placeholder="carlos@allin.io"
                  className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">CPF para Registros Fiscais</label>
                <input
                  type="text" required value={custCPF} onChange={(e) => onSetCustCPF(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Telefone WhatsApp</label>
                <input
                  type="tel" required value={custPhone} onChange={(e) => onSetCustPhone(e.target.value)}
                  placeholder="(11) 99312-0000"
                  className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Modalidade de Frete</label>
                <select
                  value={deliveryType} onChange={(e) => onSetDeliveryType(e.target.value)}
                  className="w-full h-9 rounded-lg bg-[#06080d] border border-border px-3 text-xs text-white cursor-pointer"
                >
                  <option value="sedex">Sedex Expresso Internacional (3 dias úteis)</option>
                  <option value="pac">PAC Standart (8 dias úteis)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment selector */}
          <div className="space-y-3 pt-4 border-t border-border/15">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#a855f7] bg-purple-500/15 border border-purple-500/20 px-2 rounded-md py-0.5 inline-block">2. Escolha o Método de Liquidação</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onSetPayMethod("pix")}
                className={`py-3 px-4 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  payMethod === "pix" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 bg-[#06080d] text-zinc-400"
                }`}
              >
                <QrCode className="h-4 w-4" /> Pix QR Code Autogerado
              </button>
              <button
                type="button"
                onClick={() => onSetPayMethod("card")}
                className={`py-3 px-4 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  payMethod === "card" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 bg-[#06080d] text-zinc-400"
                }`}
              >
                <CreditCard className="h-4 w-4" /> Cartão Certificado
              </button>
            </div>

            <AnimatePresence mode="wait">
              {payMethod === "card" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-background/50 rounded-xl border border-border/40 space-y-3 overflow-hidden"
                >
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-muted-foreground font-mono">Número do Cartão de Crédito</label>
                    <input
                      type="text" value={cardNumber} onChange={(e) => onSetCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full h-9 rounded-lg bg-[#06080d] border border-zinc-800 px-3 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-muted-foreground font-mono font-mono">Expiração (MM/AA)</label>
                      <input
                        type="text" value={cardExpiry} onChange={(e) => onSetCardExpiry(e.target.value)}
                        placeholder="12/29"
                        className="w-full h-9 rounded-lg bg-[#06080d] border border-zinc-800 px-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-muted-foreground font-mono font-mono">CVC de Segurança</label>
                      <input
                        type="text" value={cardCVC} onChange={(e) => onSetCardCVC(e.target.value)}
                        placeholder="123"
                        className="w-full h-9 rounded-lg bg-[#06080d] border border-zinc-800 px-3 text-xs text-white"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Shopping items / calculations */}
        <div className="md:col-span-5 space-y-5">
          <div className="rounded-2xl border border-zinc-800 bg-[#06080d] p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#a855f7] bg-purple-500/15 border border-purple-500/20 px-2 rounded-md py-0.5 inline-block">3. Resumo dos Itens</h4>
            
            <div className="space-y-3/5 max-h-48 overflow-y-auto divide-y divide-border/15 pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-2.5 items-center pt-2.5 first:pt-0 text-xs">
                  <span className="font-bold text-emerald-400 font-mono text-[11px] shrink-0">x{item.quantity}</span>
                  <span className="text-white font-medium truncate flex-1">{item.product.caption}</span>
                  <span className="font-mono text-zinc-400 shrink-0">{formatBRL(item.product.price)}</span>
                </div>
              ))}
            </div>

            {/* Meta/cashback details to sponsor */}
            <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/20 text-xs text-zinc-300 space-y-1.5 leading-relaxed font-sans">
              <p className="font-bold text-emerald-400 uppercase tracking-widest text-[9px] font-mono select-none">Bônus & Patrocínio Direto</p>
              <p>Estas aquisições faturam <strong className="text-white">R$ {(subtotal * 0.25).toFixed(2)}</strong> de cashback imediato e acumulam volume binário de rede para:</p>
              <div className="flex items-center gap-2 pt-1 border-t border-emerald-500/10 mt-1">
                <img src={distAvatar} alt={distName} className="h-6 w-6 rounded-full border border-emerald-500/30 object-cover" />
                <div>
                  <p className="font-semibold text-white text-[11px]">{distName}</p>
                  <p className="text-[9px] text-emerald-400 font-mono leading-none">@{sponsorSlug}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-zinc-800 pt-3 text-xs font-mono">
              <div className="flex justify-between text-zinc-500">
                <span>Produtos:</span>
                <span className="text-white">{formatBRL(String(subtotal))}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>Desconto Promo:</span>
                  <span>-{formatBRL(String(discount))}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Inoculação Sedex:</span>
                <span className="text-white">{deliveryCost === 0 ? "Grátis" : formatBRL(String(deliveryCost))}</span>
              </div>
              <div className="border-t border-zinc-900 pt-2 flex justify-between font-bold text-sm">
                <span className="text-white font-sans font-bold">Total Final:</span>
                <span className="text-emerald-400 font-extrabold">{formatBRL(String(finalTotal))}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 pt-0.5 cursor-pointer"
          >
            Confirmar e Contratar Gateway (R$ {finalTotal.toFixed(2)})
          </button>
        </div>
      </form>
    </motion.div>
  );
}
