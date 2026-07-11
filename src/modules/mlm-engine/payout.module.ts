import { supabase } from "@/lib/supabase/client";
import type { CommissionCycle, Commission } from "./types";

export const PayoutModule = {
  async createCycle(): Promise<CommissionCycle> {
    const ciclo = new Date().toISOString().slice(0, 7);

    const { data, error } = await supabase
      .schema("mlm")
      .from("commission_cycles")
      .insert({
        ciclo,
        qualificados: 0,
        pago: 0,
        status: "processing",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as CommissionCycle;
  },

  async runCycle(cycleId: string): Promise<{ success: boolean; processed: number }> {
    const { data: pending } = await supabase
      .schema("mlm")
      .from("comissoes")
      .select("id, valor_comissao")
      .eq("status", "pendente");

    if (!pending || pending.length === 0) {
      await supabase
        .schema("mlm")
        .from("commission_cycles")
        .update({ status: "completed" })
        .eq("id", cycleId);
      return { success: true, processed: 0 };
    }

    const totalPago = pending.reduce((sum, c) => sum + Number(c.valor_comissao || 0), 0);

    const { error: updateError } = await supabase
      .schema("mlm")
      .from("comissoes")
      .update({
        status: "pago",
        data_pagamento: new Date().toISOString(),
        ciclo_id: cycleId,
      })
      .eq("status", "pendente");

    if (updateError) throw updateError;

    await supabase
      .schema("mlm")
      .from("commission_cycles")
      .update({
        status: "completed",
        qualificados: pending.length,
        pago: totalPago,
      })
      .eq("id", cycleId);

    return { success: true, processed: pending.length };
  },

  async getCycles(): Promise<CommissionCycle[]> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("commission_cycles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as CommissionCycle[];
  },

  async getCycleCommissions(cycleId: string): Promise<Commission[]> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("comissoes")
      .select("*")
      .eq("ciclo_id", cycleId);

    if (error) throw error;
    return (data || []) as Commission[];
  },
};
