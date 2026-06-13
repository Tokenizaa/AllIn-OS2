import { formatBRL } from "@/lib/customer-calculations";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import React from "react";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  inactive: "bg-red-500/10 text-red-500/30 border-red-500/30",
  churned: "bg-muted text-muted-foreground border-border",
};

interface CustomerOrdersTabProps {
  orders: any[];
  orderItems?: any[];
  products?: any[];
}

export function CustomerOrdersTab({ orders, orderItems = [], products = [] }: CustomerOrdersTabProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Criar mapa de produtos por ID para lookup rápido
  const productMap = new Map(products.map((p) => [p.id, p]));

  // Agrupar itens por pedido
  const itemsByOrder = new Map<string, any[]>();
  orderItems.forEach((item) => {
    if (!itemsByOrder.has(item.order_id)) {
      itemsByOrder.set(item.order_id, []);
    }
    itemsByOrder.get(item.order_id)?.push(item);
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card/40 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 text-left">Nº Pedido</th>
              <th className="px-4 py-2.5 text-left">Status</th>
              <th className="px-4 py-2.5 text-left">Método de pagamento</th>
              <th className="px-4 py-2.5 text-right">Valor do pedido</th>
              <th className="px-4 py-2.5 text-left">Data de emissão</th>
              <th className="px-4 py-2.5 text-left">Itens</th>
              <th className="px-4 py-2.5 text-left">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-white/90">
            {orders.map((o) => {
              const orderItemsList = itemsByOrder.get(o.id) || [];
              const isExpanded = expandedOrder === o.id;

              return (
                <React.Fragment key={o.id}>
                  <tr className="hover:bg-accent/30 transition-all">
                    <td className="px-4 py-3 font-mono text-xs">{o.numero_pedido || o.id.slice(0, 10)}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
                        {o.status_pedido || o.status || "pendente"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground capitalize">
                      {o.payment_method || "pix"} · {o.payment_status || "pago"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-white font-medium">
                      {formatBRL(Number(o.valor_total_pedido || o.valor_total || 0))}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {o.created_at ? new Date(o.created_at).toLocaleDateString("pt-BR") : "-"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {orderItemsList.length} item(s)
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : o.id)}
                        className="text-xs text-primary hover:underline"
                      >
                        {isExpanded ? "Ocultar" : "Ver itens"}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && orderItemsList.length > 0 && (
                    <tr className="bg-accent/10">
                      <td colSpan={7} className="px-4 py-3">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Itens do Pedido:</p>
                          {orderItemsList.map((item) => {
                            const product = productMap.get(item.product_id);
                            return (
                              <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-border/30 last:border-0">
                                <div className="flex-1">
                                  <span className="font-medium text-white">{product?.nome || item.product_name || "Produto"}</span>
                                  {product?.codigo && <span className="text-muted-foreground ml-2">({product.codigo})</span>}
                                </div>
                                <div className="text-right">
                                  <span className="text-muted-foreground">Qtd: {item.quantity}</span>
                                  <span className="ml-3 text-white font-medium">{formatBRL(item.valor_total)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Sem pedidos cadastrados para esse cliente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
