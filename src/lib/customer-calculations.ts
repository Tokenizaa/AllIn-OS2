export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function calculateLTV(orders: any[]) {
  return orders
    .filter((o) => ["pago", "entregue", "enviado"].includes((o.status_pedido || o.status || "").toLowerCase()))
    .reduce((acc, o) => acc + Number(o.valor_total_pedido || o.valor_total || 0), 0);
}

export function calculateTotalComprado(orders: any[]) {
  return orders.reduce((acc, o) => acc + Number(o.valor_total_pedido || o.valor_total || 0), 0);
}

export function calculateChurnRisk(customer: any, orders: any[]) {
  if (!customer) return "N/A";
  if (customer.status === "inactive" || customer.status === "churned") return "95% (Crítico)";
  if (orders.length === 0) return "75% (Sem Compras)";
  
  const lastOrderDate = new Date(Math.max(...orders.map(o => new Date(o.created_at || 0).getTime())));
  const daysSinceLastOrder = (new Date().getTime() - lastOrderDate.getTime()) / (1000 * 3600 * 24);
  
  if (daysSinceLastOrder > 60) return "85% (Crítico - Inativo)";
  if (daysSinceLastOrder > 30) return "60% (Risco Médio)";
  if (daysSinceLastOrder > 15) return "35% (Alerta Leve)";
  return "12% (Estável / Baixo)";
}
