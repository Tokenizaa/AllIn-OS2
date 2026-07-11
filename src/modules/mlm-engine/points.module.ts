import { supabase } from "@/lib/supabase/client";
import type { PontosSaldo, PontosTransacao } from "./types";

export const PointsModule = {
  async getBalance(distribuidorId: string): Promise<PontosSaldo | null> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("pontos_saldo")
      .select("*")
      .eq("distribuidor_id", distribuidorId)
      .single();

    if (error) return null;
    return data as PontosSaldo;
  },

  async getTransactions(distribuidorId: string, limit = 50): Promise<PontosTransacao[]> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("pontos_transacoes")
      .select("*")
      .eq("distribuidor_id", distribuidorId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as PontosTransacao[];
  },

  async calculatePoints(valor: number, profundidade: number = 5): Promise<Array<{ nivel: number; pontos: number }>> {
    const pontosBase = Math.floor(valor / 10);
    const distribution: Array<{ nivel: number; pontos: number }> = [];

    let pontosAtuais = pontosBase;
    for (let i = 0; i < profundidade; i++) {
      if (pontosAtuais <= 0) break;
      distribution.push({ nivel: i + 1, pontos: pontosAtuais });
      pontosAtuais = Math.floor(pontosAtuais * 0.5);
    }

    return distribution;
  },

  async getTotalPoints(distribuidorId: string): Promise<number> {
    const balance = await this.getBalance(distribuidorId);
    return balance?.saldo_acumulado || 0;
  },

  async addPoints(distribuidorId: string, quantidade: number, tipo: string, descricao: string, pedidoId?: string): Promise<void> {
    const current = await this.getBalance(distribuidorId);
    const saldoAnterior = current?.saldo_atual || 0;
    const saldoDepois = saldoAnterior + quantidade;

    if (current) {
      await supabase
        .schema("mlm")
        .from("pontos_saldo")
        .update({
          saldo_atual: saldoDepois,
          saldo_acumulado: (current.saldo_acumulado || 0) + quantidade,
        })
        .eq("distribuidor_id", distribuidorId);
    } else {
      await supabase
        .schema("mlm")
        .from("pontos_saldo")
        .insert({
          distribuidor_id: distribuidorId,
          saldo_atual: quantidade,
          saldo_acumulado: quantidade,
        });
    }

    await supabase
      .schema("mlm")
      .from("pontos_transacoes")
      .insert({
        distribuidor_id: distribuidorId,
        tipo,
        quantidade,
        saldo_antes: saldoAnterior,
        saldo_depois: saldoDepois,
        descricao,
        pedido_id: pedidoId || null,
        created_at: new Date().toISOString(),
      });
  },
};
