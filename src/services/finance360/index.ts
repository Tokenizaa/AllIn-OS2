/**
 * Finance360 Service
 * 
 * Service focado em dados financeiros
 * Extrai do Customer360Service monolítico apenas a parte de Finance
 * 
 * Responsabilidades:
 * - Carteira monetária
 * - Carteira de pontos
 * - Transações da carteira
 * - Saques
 * 
 * Fontes de dados:
 * - wallets (carteira monetária)
 * - points_wallets (carteira de pontos)
 * - wallet_transactions (transações)
 * - withdrawals (saques)
 */

import { supabase } from "@/lib/supabase/client";
import type {
  Wallet,
  PointsWallet,
  WalletTransaction,
} from "../customer360/types";

export const Finance360Service = {
  /**
   * Busca dados financeiros de um perfil
   * 
   * @param profileId - ID do profile (UUID)
   * @param idComprador - ID do comprador (chave de negócio, opcional)
   * @returns Dados financeiros do perfil
   */
  async getFinance360(profileId: string, idComprador?: string): Promise<{
    wallet: Wallet | null;
    pointsWallet: PointsWallet | null;
    walletTransactions: WalletTransaction[];
  }> {
    // Se não tiver id_comprador, tenta buscar do profile
    let effectiveIdComprador = idComprador;
    if (!effectiveIdComprador) {
      const { data: profile } = await supabase
        .from("crm.customers")
        .select("id_comprador")
        .eq("id", profileId)
        .maybeSingle();
      effectiveIdComprador = profile?.id_comprador;
    }

    if (!effectiveIdComprador) {
      return {
        wallet: null,
        pointsWallet: null,
        walletTransactions: [],
      };
    }

    // Busca dados em paralelo
    const [wallet, pointsWallet] = await Promise.all([
      this.fetchWallet(effectiveIdComprador),
      this.fetchPointsWallet(effectiveIdComprador),
    ]);

    // Busca transações sequencialmente (depende da wallet)
    let walletTransactions: WalletTransaction[] = [];
    if (wallet) {
      walletTransactions = await this.fetchWalletTransactions(wallet.id);
    }

    return {
      wallet,
      pointsWallet,
      walletTransactions,
    };
  },

  // ============================================================================
  // MÉTODOS DE BUSCA
  // ============================================================================

  /**
   * Busca carteira do customer
   */
  async fetchWallet(idComprador: string): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from("finance.wallets")
      .select("*")
      .eq("id_comprador", idComprador)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Busca carteira de pontos do customer
   */
  async fetchPointsWallet(idComprador: string): Promise<PointsWallet | null> {
    const { data, error } = await supabase
      .from("finance.points_wallets")
      .select("*")
      .eq("id_comprador", idComprador)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Busca transações da carteira
   */
  async fetchWalletTransactions(walletId: string): Promise<WalletTransaction[]> {
    const { data, error } = await supabase
      .from("finance.wallet_transactions")
      .select("*")
      .eq("wallet_id", walletId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  },
};
