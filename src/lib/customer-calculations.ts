/**
 * Customer Calculations Utility
 * 
 * NOTE: As funções calculateLTV, calculateTotalComprado e calculateChurnRisk foram removidas
 * porque esses cálculos já são feitos no banco de dados e armazenados nas tabelas:
 * - customer_metrics.ltv (LTV)
 * - customer_metrics.total_gasto (Total Comprado)
 * - customer_scores.churn_score (Churn Risk)
 * 
 * Use os campos pré-calculados do banco para garantir consistência e performance.
 */

export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}
