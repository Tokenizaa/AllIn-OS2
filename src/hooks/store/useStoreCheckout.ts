import { useState } from "react";
import { toast } from "sonner";
import { CheckoutRules } from "@/services/orders";
import { supabase } from "@/lib/supabase/client";

interface UseStoreCheckoutProps {
  cart: { product: any; quantity: number }[];
  subtotal: number;
  discount: number;
  deliveryCost: number;
  finalTotal: number;
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
    const { valid, discount } = CheckoutRules.calculateDiscount(subtotal, coupon);
    if (valid) {
      setDiscount(discount);
      toast.success("Cupom de desconto aplicado!");
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

    try {
      const totalPoints = CheckoutRules.calculateCartPoints(cart);

      const { data: pedido, error: pedidoError } = await supabase
        .schema("commerce")
        .from("pedidos")
        .insert({
          cliente_nome: custName,
          cliente_email: custEmail,
          cliente_telefone: custPhone,
          cliente_cpf: custCPF,
          valor_total: finalTotal,
          tipo_nome: "Produto",
          pagamento_confirmado: true,
          comissoes_geradas: false,
          metadata: {
            sponsor_slug: sponsorSlug,
            itens: cart.map((i) => ({
              produto_id: i.product.id,
              nome: i.product.name,
              quantidade: i.quantity,
              preco: i.product.price,
            })),
          },
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      toast.success("Pedido faturado! Comissões vinculadas automaticamente via trigger.");
      setCheckoutStep("receipt");
    } catch {
      toast.error("Erro no processamento da transação.");
      setCheckoutStep("checkout");
    }
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
