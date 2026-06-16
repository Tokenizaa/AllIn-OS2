/**
 * Profile360 Service
 * 
 * Service focado em dados de perfil básico do usuário
 * Extrai do Customer360Service monolítico apenas a parte de Profile
 * 
 * Responsabilidades:
 * - Dados básicos do perfil (nome, email, telefone, etc)
 * - Métricas de negócio (LTV, total gasto, ticket médio)
 * - Métricas de rede (total rede, indicações diretas)
 * - Score de engajamento
 * 
 * Fontes de dados:
 * - customer_360_view (view consolidada - otimizado)
 * - crm.customers (tabela principal)
 */

/**
 * Profile360Service
 * 
 * IDENTIFIER STRATEGY:
 * This service uses `id_comprador` (text) as the canonical identifier for fetching profile data.
 * The `customers.id` (UUID) is only used as a technical primary key in the database.
 * 
 * Rationale: The entire application is built around id_comprador (247 occurrences across 54 files).
 * Using it consistently avoids confusion and maintains compatibility with the existing system.
 * 
 * For migration planning, see: docs/IDENTITY_MIGRATION_MASTER_PLAN.md
 */

import { supabase } from "@/lib/supabase-client";
import type {
  CustomerProfile,
  CustomerMetrics,
  CustomerNetworkMetrics,
  CustomerScore,
} from "../customer360/types";

export const Profile360Service = {
  /**
   * Busca visão 360 do perfil por profile_id
   * 
   * @deprecated Use getProfile360ByIdComprador() instead. This method accepts UUID but converts to id_comprador internally.
   * @param profileId - ID do profile (UUID)
   * @returns Dados do perfil com métricas
   */
  async getProfile360(profileId: string): Promise<{
    profile: CustomerProfile | null;
    metrics: CustomerMetrics | null;
    networkMetrics: CustomerNetworkMetrics | null;
    score: CustomerScore | null;
  }> {
    // Primeiro busca o profile para obter id_comprador se necessário
    const profile = await this.fetchProfileById(profileId);
    
    if (!profile) {
      return {
        profile: null,
        metrics: null,
        networkMetrics: null,
        score: null,
      };
    }

    // Se tiver id_comprador, busca dados da view otimizada
    if (profile.id_comprador) {
      const viewData = await this.fetchCustomer360View(profile.id_comprador);
      
      if (viewData) {
        return {
          profile: this.mapViewToProfile(viewData),
          metrics: this.mapViewToMetrics(viewData),
          networkMetrics: this.mapViewToNetworkMetrics(viewData),
          score: this.mapViewToScore(viewData),
        };
      }
    }

    // Fallback: busca dados individuais
    const [metrics, networkMetrics, score] = await Promise.all([
      profile.id_comprador ? this.fetchMetrics(profile.id_comprador) : Promise.resolve(null),
      profile.id_comprador ? this.fetchNetworkMetrics(profile.id_comprador) : Promise.resolve(null),
      profile.id_comprador ? this.fetchScore(profile.id_comprador) : Promise.resolve(null),
    ]);

    return {
      profile,
      metrics,
      networkMetrics,
      score,
    };
  },

  /**
   * Busca visão 360 do perfil por id_comprador
   * 
   * @param idComprador - ID do comprador (chave de negócio)
   * @returns Dados do perfil com métricas
   */
  async getProfile360ByIdComprador(idComprador: string): Promise<{
    profile: CustomerProfile | null;
    metrics: CustomerMetrics | null;
    networkMetrics: CustomerNetworkMetrics | null;
    score: CustomerScore | null;
  }> {
    // Busca dados consolidados da view otimizada
    const viewData = await this.fetchCustomer360View(idComprador);
    
    if (viewData) {
      return {
        profile: this.mapViewToProfile(viewData),
        metrics: this.mapViewToMetrics(viewData),
        networkMetrics: this.mapViewToNetworkMetrics(viewData),
        score: this.mapViewToScore(viewData),
      };
    }

    // Fallback: busca dados individuais
    const [profile, metrics, networkMetrics, score] = await Promise.all([
      this.fetchProfileByIdComprador(idComprador),
      this.fetchMetrics(idComprador),
      this.fetchNetworkMetrics(idComprador),
      this.fetchScore(idComprador),
    ]);

    return {
      profile,
      metrics,
      networkMetrics,
      score,
    };
  },

  // ============================================================================
  // MÉTODOS DE BUSCA
  // ============================================================================

  /**
   * Busca dados consolidados da customer_360_view (OTIMIZADO)
   */
  async fetchCustomer360View(idComprador: string): Promise<any | null> {
    const { data, error } = await supabase
      .from("customer_360_view")
      .select("*")
      .eq("id_comprador", idComprador)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Mapeia dados da view para CustomerProfile
   */
  mapViewToProfile(viewData: any): CustomerProfile {
    return {
      id: viewData.id,
      id_comprador: viewData.id_comprador,
      user_id: viewData.user_id || null,
      usuario: viewData.usuario,
      nome_completo: viewData.nome_completo,
      email: viewData.email,
      telefone: viewData.telefone,
      cpf: viewData.cpf,
      endereco: viewData.endereco,
      cidade: viewData.cidade,
      estado: viewData.estado,
      cep: viewData.cep,
      qualification: viewData.qualification,
      plano_comprador: viewData.plan_name || null,
      status: viewData.status,
      metadata: null,
      created_at: viewData.data_cadastro || viewData.created_at,
      updated_at: new Date().toISOString(),
      patrocinador_comprador: viewData.patrocinador_comprador || null,
    };
  },

  /**
   * Mapeia dados da view para CustomerMetrics
   */
  mapViewToMetrics(viewData: any): CustomerMetrics | null {
    if (!viewData.ltv && !viewData.total_gasto) return null;
    return {
      id_comprador: viewData.id_comprador,
      ltv: viewData.ltv || 0,
      total_gasto: viewData.total_gasto || 0,
      ticket_medio: viewData.ticket_medio || 0,
      numero_pedidos: viewData.total_pedidos || 0,
      primeiro_pedido: null, // Não disponível na view
      ultimo_pedido: viewData.ultimo_pedido,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  /**
   * Mapeia dados da view para CustomerNetworkMetrics
   */
  mapViewToNetworkMetrics(viewData: any): CustomerNetworkMetrics | null {
    if (!viewData.total_downlines && !viewData.network_revenue) return null;
    return {
      id_comprador: viewData.id_comprador,
      total_network_size: viewData.total_downlines || 0,
      direct_indications: 0, // Não disponível na view
      estimated_bonus: viewData.network_revenue || 0, // Usando network_revenue como proxy
      network_level: 0, // Não disponível na view
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  /**
   * Mapeia dados da view para CustomerScore
   */
  mapViewToScore(viewData: any): CustomerScore | null {
    if (!viewData.engagement_score && !viewData.churn_score) return null;
    // Usando engagement_score como score principal
    return {
      id_comprador: viewData.id_comprador,
      score: viewData.engagement_score || viewData.churn_score || 0,
      metadata: {
        churn_score: viewData.churn_score,
        loyalty_score: viewData.loyalty_score,
        activity_score: viewData.activity_score,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  /**
   * Busca perfil por profile_id
   */
  async fetchProfileById(profileId: string): Promise<CustomerProfile | null> {
    const { data, error } = await supabase
      .schema("crm")
      .from("customers")
      .select("*")
      .eq("id", profileId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Busca perfil por id_comprador
   */
  async fetchProfileByIdComprador(idComprador: string): Promise<CustomerProfile | null> {
    const { data, error } = await supabase
      .schema("crm")
      .from("customers")
      .select("*")
      .eq("id_comprador", idComprador)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Busca métricas do customer
   * ATUALIZADO: Tabela agora tem id_comprador column (migration 20260611)
   * Query direta usando id_comprador (identificador canônico)
   */
  async fetchMetrics(idComprador: string): Promise<CustomerMetrics | null> {
    try {
      // Query direta usando id_comprador (adicionado na migration)
      const { data, error } = await supabase
        .from("customer_metrics")
        .select("*")
        .eq("id_comprador", idComprador)
        .maybeSingle();

      if (error) {
        console.warn("customer_metrics table error:", error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn("customer_metrics fetch failed:", err);
      return null;
    }
  },

  /**
   * Busca métricas de rede do customer
   * ATUALIZADO: Tabela agora tem id_comprador column (migration 20260611)
   * Query direta usando id_comprador (identificador canônico)
   */
  async fetchNetworkMetrics(idComprador: string): Promise<CustomerNetworkMetrics | null> {
    try {
      // Query direta usando id_comprador (adicionado na migration)
      const { data, error } = await supabase
        .from("customer_network_metrics")
        .select("*")
        .eq("id_comprador", idComprador)
        .maybeSingle();

      if (error) {
        console.warn("customer_network_metrics table error:", error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn("customer_network_metrics fetch failed:", err);
      return null;
    }
  },

  /**
   * Busca score do customer
   * ATUALIZADO: Tabela agora tem id_comprador column (migration 20260611)
   * Query direta usando id_comprador (identificador canônico)
   */
  async fetchScore(idComprador: string): Promise<CustomerScore | null> {
    try {
      // Query direta usando id_comprador (adicionado na migration)
      const { data, error } = await supabase
        .from("customer_scores")
        .select("*")
        .eq("id_comprador", idComprador)
        .maybeSingle();

      if (error) {
        console.warn("customer_scores table error:", error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn("customer_scores fetch failed:", err);
      return null;
    }
  },
};
