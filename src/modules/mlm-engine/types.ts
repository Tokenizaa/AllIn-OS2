export type PlanName = "afiliado" | "avanco" | "excelencia";

export interface Plan {
  id: string;
  nome: string;
  slug?: string;
  description?: string;
  preco: number;
  ativo: boolean;
  max_geracoes: number;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface PlanAssignment {
  id: string;
  distribuidor_id: string;
  plano_id: string;
  data_ativacao: string;
  ativo: boolean;
  status: string;
}

export interface Distribuidor {
  id: string;
  nome: string;
  email?: string;
  allin_id?: string;
  patrocinador_id?: string;
  ativo: boolean;
  status: string;
  nivel?: string;
  data_cadastro?: string;
  metadata?: Record<string, any>;
}

export interface NetworkNode {
  id_distribuidor: string;
  id_patrocinador: string | null;
  linha: number;
  posicao_relativa: number;
  created_at?: string;
}

export interface BonusRegra {
  id: string;
  nome: string;
  tipo: "direto" | "patrocinador" | "geracao" | "lideranca";
  geracao: number | null;
  porcentagem: number;
  valor_fixo?: number;
  pontos_minimos?: number;
  volume_minimo?: number;
  diretos_minimos?: number;
  periodo_tipo?: string;
  periodo_dias?: number;
  data_inicio?: string;
  data_fim?: string;
  configuracoes: Record<string, any> | null;
  descricao?: string;
  is_active: boolean;
  plan_id: string | null;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

export interface Commission {
  id: string;
  pedido_id: string;
  tipo: string;
  geracao: number | null;
  valor_base: number;
  porcentagem: number;
  valor_comissao: number;
  status: "pendente" | "pago" | "cancelado";
  data_calculo: string;
  data_pagamento?: string;
  distribuidor_id: string;
  descricao?: string;
  referencia_id?: string;
  referencia_tipo?: string;
  ciclo_id?: string;
}

export interface PontosSaldo {
  distribuidor_id: string;
  saldo_atual: number;
  saldo_acumulado: number;
  updated_at?: string;
}

export interface PontosTransacao {
  id: string;
  distribuidor_id: string;
  tipo: "ativacao" | "qualificacao" | "rede" | "compra";
  quantidade: number;
  saldo_antes: number;
  saldo_depois: number;
  descricao: string;
  pedido_id?: string;
  created_at: string;
}

export interface Qualificacao {
  codigo: string;
  nome: string;
  pontos_minimos: number;
  max_geracoes: number;
  bonus_direto: number;
  bonus_geracao: number;
}

export interface QualificacaoHistorico {
  id: string;
  distribuidor_id: string;
  nivel_anterior: string | null;
  nivel_novo: string;
  data_mudanca: string;
  pontos_acumulados: number;
}

export interface CommissionCycle {
  id: string;
  ciclo: string;
  qualificados: number;
  pago: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface WalletBalance {
  distribuidor_id: string;
  saldo: number;
  bloqueado: number;
  disponivel: number;
}

export interface WalletTransaction {
  id: string;
  distribuidor_id: string;
  tipo: string;
  valor: number;
  saldo_antes: number;
  saldo_depois: number;
  descricao: string;
  commission_id?: string;
  created_at: string;
}

export interface ProcessingResult {
  success: boolean;
  message: string;
  comissoes_geradas?: number;
  pontos_gerados?: number;
}

export interface CommissionBreakdown {
  direct: number;
  sponsor: number;
  generations: Array<{ generation: number; percentage: number; amount: number }>;
  leadership: number;
  total: number;
}

export interface UpgradeSuggestion {
  plano_atual: string;
  plano_sugerido: string;
  motivo: string;
  pontos_necessarios: number;
}
