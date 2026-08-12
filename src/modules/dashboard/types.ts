export interface DashboardStats {
  saldoDisponivel: number;
  comissaoAcumulada: number;
  totalVendido: number;
  pedidosMes: number;
  redeTotal: number;
  ticketMedio: number;
  conversaoLoja: number;
  crescimentoRedeMes: number;
  nome: string;
  qualificacao: string;
  plano: string;
  progresso: number;
  proximaQualificacao: string;
  linkLoja: string;
}

export interface SalesSeriesPoint {
  day: string;
  vendas: number;
  bonus: number;
}

export interface BonusOriginPoint {
  name: string;
  value: number;
}

export interface TopProduct {
  name: string;
  qtd: number;
  receita: number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  at: string;
  type: "order" | "payment";
}

export interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
}

export interface AIInsight {
  id: string;
  title: string;
  detail: string;
  action: string;
}

export interface DashboardViewModel {
  stats: DashboardStats;
  salesSeries: SalesSeriesPoint[];
  bonusOrigin: BonusOriginPoint[];
  topProducts: TopProduct[];
  timeline: TimelineEvent[];
  aiInsights: AIInsight[];
  goals: Goal[];
}