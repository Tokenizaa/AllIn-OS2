import { supabase } from "@/lib/supabase/client";
import type { WalletBalance, WalletTransaction } from "./types";

export const WalletModule = {
  async getBalance(distribuidorId: string): Promise<WalletBalance> {
    const { data } = await supabase
      .schema("mlm")
      .from("carteiras")
      .select("*")
      .eq("distribuidor_id", distribuidorId)
      .single();

    if (!data) {
      return { distribuidor_id: distribuidorId, saldo: 0, bloqueado: 0, disponivel: 0 };
    }

    return {
      distribuidor_id: distribuidorId,
      saldo: Number(data.saldo || 0),
      bloqueado: Number(data.bloqueado || 0),
      disponivel: Number(data.saldo || 0) - Number(data.bloqueado || 0),
    };
  },

  async addFunds(distribuidorId: string, valor: number, origem: string, commissionId?: string): Promise<WalletTransaction> {
    const balance = await this.getBalance(distribuidorId);
    const saldoAnterior = balance.saldo;
    const saldoDepois = saldoAnterior + valor;

    const { data: carteira } = await supabase
      .schema("mlm")
      .from("carteiras")
      .select("id")
      .eq("distribuidor_id", distribuidorId)
      .single();

    if (carteira) {
      await supabase
        .schema("mlm")
        .from("carteiras")
        .update({ saldo: saldoDepois })
        .eq("distribuidor_id", distribuidorId);
    } else {
      await supabase
        .schema("mlm")
        .from("carteiras")
        .insert({
          distribuidor_id: distribuidorId,
          saldo: valor,
          bloqueado: 0,
        });
    }

    const { data: tx, error } = await supabase
      .schema("mlm")
      .from("carteiras_transacoes")
      .insert({
        distribuidor_id: distribuidorId,
        tipo: origem,
        valor,
        saldo_antes: saldoAnterior,
        saldo_depois: saldoDepois,
        descricao: `Crédito: ${origem}`,
        commission_id: commissionId || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return tx as WalletTransaction;
  },

  async withdraw(distribuidorId: string, valor: number): Promise<WalletTransaction> {
    const balance = await this.getBalance(distribuidorId);
    if (balance.disponivel < valor) {
      throw new Error("Saldo insuficiente");
    }

    const saldoDepois = balance.saldo - valor;

    await supabase
      .schema("mlm")
      .from("carteiras")
      .update({ saldo: saldoDepois })
      .eq("distribuidor_id", distribuidorId);

    const { data: tx, error } = await supabase
      .schema("mlm")
      .from("carteiras_transacoes")
      .insert({
        distribuidor_id: distribuidorId,
        tipo: "saque",
        valor: -valor,
        saldo_antes: balance.saldo,
        saldo_depois: saldoDepois,
        descricao: "Saque solicitado",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return tx as WalletTransaction;
  },

  async getTransactions(distribuidorId: string, limit = 50): Promise<WalletTransaction[]> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("carteiras_transacoes")
      .select("*")
      .eq("distribuidor_id", distribuidorId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as WalletTransaction[];
  },
};
