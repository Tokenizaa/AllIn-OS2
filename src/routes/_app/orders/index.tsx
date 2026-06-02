import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/widgets/page-header";
import { supabase } from "@/lib/supabase-client";

export const Route = createFileRoute("/_app/orders/")({ component: OrdersPage });

const statusColor: Record<string, string> = {
  pago: "bg-success/15 text-success border-success/30",
  pendente: "bg-warning/15 text-warning border-warning/30",
  enviado: "bg-info/15 text-info border-info/30",
  entregue: "bg-success/15 text-success border-success/30",
  cancelado: "bg-destructive/15 text-destructive border-destructive/30",
};

function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: ordersData }, { data: customersData }] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(60),
        supabase.from("customers").select("id, usuario, id_comprador, user_id, qualification, telefone, metadata, name").order("created_at", { ascending: false }),
      ]);
      setOrders(ordersData || []);
      setCustomers(customersData || []);
    })();
  }, []);

  const total = orders.reduce((sum, o) => sum + Number(o.valor_total_pedido || o.valor_total || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Comercial"
        title="Pedidos"
        subtitle={`${orders.length} pedidos no período · R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em receita bruta`}
      />
      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 text-left">Pedido</th>
              <th className="px-4 py-2.5 text-left">Cliente</th>
              <th className="px-4 py-2.5 text-left">Status</th>
              <th className="px-4 py-2.5 text-left">Pagamento</th>
              <th className="px-4 py-2.5 text-right">Itens</th>
              <th className="px-4 py-2.5 text-right">Total</th>
              <th className="px-4 py-2.5 text-left">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {orders.map((o) => {
              const customer = customers.find((x) => x.id === o.customer_id);
              const customerLabel = customer?.name || customer?.usuario || customer?.id_comprador || customer?.user_id || customer?.id || o.customer_id;
              return (
                <tr key={o.id} className="hover:bg-accent/30">
                  <td className="px-4 py-3 font-mono text-xs">{o.numero_pedido || o.id}</td>
                  <td className="px-4 py-3">
                    {customer ? (
                      <Link to="/customers/$id" params={{ id: customer.id }} className="hover:text-primary">
                        {customerLabel}
                      </Link>
                    ) : (
                      o.customer_id || "-"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] capitalize ${statusColor[o.status_pedido || "pendente"]}`}>
                      {o.status_pedido || "pendente"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{o.payment_method || "-"}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{Array.isArray(o.items) ? o.items.length : 0}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium">
                    R$ {(Number(o.valor_total_pedido || o.valor_total || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {o.created_at ? new Date(o.created_at).toLocaleDateString("pt-BR") : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
