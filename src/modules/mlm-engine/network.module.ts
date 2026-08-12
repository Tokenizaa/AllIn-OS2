import { supabase } from "@/lib/supabase/client";
import type { NetworkNode, Distribuidor } from "./types";

export const NetworkModule = {
  async getUpline(distribuidorId: string, maxGeracoes: number = 10): Promise<NetworkNode[]> {
    const nodes: NetworkNode[] = [];
    let currentId = distribuidorId;

    for (let i = 0; i < maxGeracoes; i++) {
      const { data, error } = await supabase
        .schema("mlm")
        .from("rede_linear_nos")
        .select("*")
        .eq("id_distribuidor", currentId)
        .limit(1)
        .single();

      if (error || !data?.id_patrocinador) break;

      const { data: parentNode } = await supabase
        .schema("mlm")
        .from("rede_linear_nos")
        .select("*")
        .eq("id_distribuidor", data.id_patrocinador)
        .limit(1)
        .single();

      if (parentNode) {
        nodes.push({ ...parentNode, linha: i + 1 });
      }

      currentId = data.id_patrocinador;
    }

    return nodes;
  },

  async getDownline(distribuidorId: string, maxLevels: number = 3): Promise<NetworkNode[]> {
    const nodes: NetworkNode[] = [];
    const queue: Array<{ id: string; level: number }> = [{ id: distribuidorId, level: 0 }];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.level >= maxLevels) continue;

      const { data } = await supabase
        .schema("mlm")
        .from("rede_linear_nos")
        .select("*")
        .eq("id_patrocinador", current.id);

      if (data) {
        for (const node of data) {
          nodes.push({ ...node, linha: current.level + 1 });
          queue.push({ id: node.id_distribuidor, level: current.level + 1 });
        }
      }
    }

    return nodes;
  },

  async countDirects(distribuidorId: string): Promise<number> {
    const { count, error } = await supabase
      .schema("mlm")
      .from("rede_linear_nos")
      .select("*", { count: "exact", head: true })
      .eq("id_patrocinador", distribuidorId);

    if (error) throw error;
    return count || 0;
  },

  async countActiveDirects(distribuidorId: string): Promise<number> {
    const { data: nodes } = await supabase
      .schema("mlm")
      .from("rede_linear_nos")
      .select("id_distribuidor")
      .eq("id_patrocinador", distribuidorId);

    if (!nodes || nodes.length === 0) return 0;

    const { data: active } = await supabase
      .schema("mlm")
      .from("distribuidores")
      .select("id")
      .in("id", nodes.map((n) => n.id_distribuidor))
      .eq("ativo", true);

    return active?.length || 0;
  },

  async getSponsor(distribuidorId: string): Promise<Distribuidor | null> {
    const { data: node } = await supabase
      .schema("mlm")
      .from("rede_linear_nos")
      .select("id_patrocinador")
      .eq("id_distribuidor", distribuidorId)
      .limit(1)
      .single();

    if (!node?.id_patrocinador) return null;

    const { data: sponsor } = await supabase
      .schema("mlm")
      .from("distribuidores")
      .select("*")
      .eq("id", node.id_patrocinador)
      .single();

    return (sponsor as Distribuidor) || null;
  },

  async insertNode(distribuidorId: string, patrocinadorId: string): Promise<void> {
    const { error } = await supabase
      .schema("mlm")
      .from("rede_linear_nos")
      .insert({
        id_distribuidor: distribuidorId,
        id_patrocinador: patrocinadorId,
        linha: 0,
        posicao_relativa: Date.now(),
        created_at: new Date().toISOString(),
      });

    if (error) throw error;
  },

  async rebuildNetwork(): Promise<void> {
    console.warn("[NetworkModule] rebuildNetwork not yet implemented");
  },
};
