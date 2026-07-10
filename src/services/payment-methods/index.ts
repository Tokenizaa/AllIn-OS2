import { supabase } from "@/lib/supabase/client";

/**
 * PaymentMethodService — Formas de Pagamento
 *
 * Sprint 6 — Domain Consolidation (PAYMENTS REDESIGN).
 *
 * FONTE DA VERDADE: `commerce.formas_pagamento`
 *
 * Substitui o método genérico "fetch payment methods" do PaymentsService antigo.
 */

export interface FormaPagamento {
  id: string;
  nome: string;
  codigo: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const PaymentMethodService = {
  /**
   * Lista formas de pagamento ativas.
   * (Política RLS permite leitura pública para registros ativos.)
   */
  async fetchActivePaymentMethods() {
    const { data, error } = await supabase
      .schema('commerce')
      .from('formas_pagamento')
      .select('*')
      .eq('is_active', true)
      .order('nome', { ascending: true });
    if (error) throw new Error(error.message || "Failed to fetch payment methods");
    return (data || []) as FormaPagamento[];
  },

  /**
   * Lista TODAS as formas (admin).
   */
  async fetchAllPaymentMethods() {
    const { data, error } = await supabase
      .schema('commerce')
      .from('formas_pagamento')
      .select('*')
      .order('nome', { ascending: true });
    if (error) throw new Error(error.message || "Failed to fetch all payment methods");
    return (data || []) as FormaPagamento[];
  },

  /**
   * Busca por código (ex: "PIX", "CREDIT_CARD").
   */
  async fetchByCodigo(codigo: string) {
    const { data, error } = await supabase
      .schema('commerce')
      .from('formas_pagamento')
      .select('*')
      .eq('codigo', codigo)
      .maybeSingle();
    if (error) throw new Error(error.message || "Failed to fetch payment method by code");
    return data as FormaPagamento | null;
  },

  /**
   * Busca por ID.
   */
  async fetchById(id: string) {
    const { data, error } = await supabase
      .schema('commerce')
      .from('formas_pagamento')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message || "Failed to fetch payment method by ID");
    return data as FormaPagamento | null;
  },
};
