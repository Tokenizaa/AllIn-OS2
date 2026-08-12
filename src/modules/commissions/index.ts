/**
 * Tipos do módulo de Comissões
 * Models visuais consumidos pela UI após transformação via RPC.
 */

export interface CommissionRow {
  id: string;
  ciclo: string;
  qualificados: number;
  pago: number;
  status: string;
  distribuidor_id?: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface CommissionsStats {
  total_pago_mes: number;
  total_pendente_mes: number;
  ciclos_no_mes: number;
  bonus_medio: number;
}

export interface CommissionsViewModel {
  rows: CommissionRow[];
  stats: CommissionsStats;
}

export interface Plan {
  id: string;
  nome: string;
  slug?: string;
  preco?: number;
  ativo?: boolean;
}

export interface Customer {
  id: string;
  id_comprador?: string;
  nome?: string;
  email?: string;
}

export { CommissionsRepository } from "./repository";
export { useCommissionsDashboard } from "./useCommissions";
