import { useState } from "react";
import { toast } from "sonner";

interface UseStoreCheckoutProps {
  cart: { product: any; quantity: number }[];
  subtotal: number;
  discount: number;
  deliveryCost: number;
  finalTotal: number;
  triggerBinomialBonusPay: (points: number, commission: number, total: number) => Promise<void>;
  addAuditLog: (log: any) => void;
  sponsorSlug: string;
  clearCart: () => void;
  setCheckoutStep: (step: string) => void;
}

export function useStoreCheckout({
  cart,
  subtotal,
  discount,
  deliveryCost,
  finalTotal,
  triggerBinomialBonusPay,
  addAuditLog,
  sponsorSlug,
  clearCart,
  setCheckoutStep,
}: UseStoreCheckoutProps) {
  const [coupon, setCoupon] = useState("");
  const [discountValue, setDiscount] = useState(0);
  
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custCPF, setCustCPF] = useState("");
  const [deliveryType, setDeliveryType] = useState("sedex");
  const [payMethod, setPayMethod] = useState<"pix" | "card">("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  const applyCouponHandler = () => {
    if (coupon.trim().toUpperCase() === "ALLIN10") {
      setDiscount(subtotal * 0.1);
      toast.success("Cupom de 10% de desconto aplicado!");
    } else {
      toast.error("Cupom inválido.");
    }
  };

  const startCheckout = () => {
    if (cart.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }
    setCheckoutStep("checkout");
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail || !custPhone || !custCPF) {
      toast.error("Por favor, preencha todos os dados de cobrança.");
      return;
    }

    setCheckoutStep("processing");

    setTimeout(async () => {
      try {
        const totalPoints = cart.reduce((acc, item) => {
          const points = item.product.bonus_payment_percentage || 20;
          return acc + (points * item.quantity);
        }, 0);

        const totalCommission = cart.reduce((acc, item) => {
          const comm = (parseFloat(item.product.price) * 0.25) * item.quantity;
          return acc + comm;
        }, 0);

        await triggerBinomialBonusPay(totalPoints, totalCommission, finalTotal);

        addAuditLog({
          id: `tx-${Math.random().toString(36).substring(3, 11)}`,
          action: "RETAIL_SALE",
          userId: "anonymous-guest-customer",
          userName: custName,
          userRole: "customer",
          module: "orders",
          details: `Venda de varejo via loja de @${sponsorSlug}. Comprador: ${custName} (${custEmail}). Itens: ${cart.map(i => `${i.product.name} (x${i.quantity})`).join(", ")}. Total: R$ ${finalTotal.toFixed(2)}. Distribuindo ${totalPoints} pontos e comissão de R$ ${totalCommission.toFixed(2)} ao sponsor.`,
          ip: "187.12.92.54"
        });

        toast.success("Pedido faturado! Comissões vinculadas instantaneamente.");
        setCheckoutStep("receipt");
      } catch {
        toast.error("Erro no processamento da transação.");
        setCheckoutStep("checkout");
      }
    }, 3000);
  };

  const handleReturnToCatalog = () => {
    clearCart();
    setCheckoutStep("catalog");
  };

  return {
    coupon,
    setCoupon,
    discount: discountValue,
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
  };
}
