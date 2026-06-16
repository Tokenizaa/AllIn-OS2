/**
 * MLM360 Service
 * 
 * Service focado em dados de MLM (Multi-Level Marketing)
 * Extrai do Customer360Service monolítico apenas a parte de MLM
 * 
 * Responsabilidades:
 * - Relacionamentos de rede
 * - Downlines (indicações diretas)
 * - Sponsor (patrocinador)
 * - Upline (linha ascendente)
 * 
 * Fontes de dados:
 * - network_relationships (relacionamentos de rede)
 * - customers (downlines e sponsor)
 */

import { supabase } from "@/lib/supabase-client";
import type {
  NetworkRelationship,
  Downline,
  Sponsor,
} from "../customer360/types";

export const MLM360Service = {
  /**
   * Busca dados MLM de um perfil
   * 
   * @param profileId - ID do profile (UUID)
   * @param idComprador - ID do comprador (chave de negócio, opcional)
   * @returns Dados MLM do perfil
   */
  async getMLM360(profileId: string, idComprador?: string): Promise<{
    networkRelationships: NetworkRelationship[];
    downlines: Downline[];
    sponsor: Sponsor | null;
  }> {
    // Se não tiver id_comprador, tenta buscar do profile
    let effectiveIdComprador = idComprador;
    if (!effectiveIdComprador) {
      const { data: profile } = await supabase
        .schema("crm")
        .from("customers")
        .select("id_comprador, patrocinador_comprador")
        .eq("id", profileId)
        .maybeSingle();
      effectiveIdComprador = profile?.id_comprador;
    }

    if (!effectiveIdComprador) {
      return {
        networkRelationships: [],
        downlines: [],
        sponsor: null,
      };
    }

    // Busca dados em paralelo
    const [networkRelationships, downlines, sponsor] = await Promise.all([
      this.fetchNetworkRelationships(effectiveIdComprador),
      this.fetchDownlines(effectiveIdComprador),
      this.fetchSponsor(effectiveIdComprador),
    ]);

    return {
      networkRelationships,
      downlines,
      sponsor,
    };
  },

  // ============================================================================
  // MÉTODOS DE BUSCA
  // ============================================================================

  /**
   * Busca relacionamentos de rede do customer
   */
  async fetchNetworkRelationships(idComprador: string): Promise<NetworkRelationship[]> {
    const { data, error } = await supabase
      .schema("mlm")
      .from("network_relationships")
      .select("*")
      .eq("id_comprador", idComprador)
      .limit(100);

    if (error) throw error;
    return data || [];
  },

  /**
   * Busca downlines (indicações diretas) do customer
   */
  async fetchDownlines(idComprador: string): Promise<Downline[]> {
    const { data, error } = await supabase
      .schema("crm")
      .from("customers")
      .select("id, id_comprador, usuario, nome_completo, email, telefone, cidade, estado, created_at")
      .eq("patrocinador_comprador", idComprador)
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw error;
    return data || [];
  },

  /**
   * Busca sponsor (patrocinador) do customer
   */
  async fetchSponsor(idComprador: string): Promise<Sponsor | null> {
    // Primeiro busca o customer para obter o patrocinador
    const { data: customer } = await supabase
      .schema("crm")
      .from("customers")
      .select("patrocinador_comprador")
      .eq("id_comprador", idComprador)
      .maybeSingle();

    if (!customer?.patrocinador_comprador) {
      return null;
    }

    const { data, error } = await supabase
      .schema("crm")
      .from("customers")
      .select("id, id_comprador, usuario, nome_completo, email")
      .eq("id_comprador", customer.patrocinador_comprador)
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};
