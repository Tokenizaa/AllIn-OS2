import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, Search, Filter, Download, RotateCcw, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/distributor/stat-card";
import { useOrders } from "@/hooks/orders/useOrders";
import { formatBRL } from "@/lib/customer-calculations";

type OrderRow = {
  id: string;
  order_number?: string | null;
  status?: string | null;
  order_type?: string | null;
  payment_method?: string | null;
  total_amount?: number | null;
  customer_name?: string | null;
  created_at?: string | null;
};

export const Route = createFileRoute("/distributor/orders")({ component: OrdersPage });

const statusColors: Record<string, string> = {
  pago: "bg-success/15 text-success border-success/30",
  entregue: "bg-primary/15 text-primary border-primary/30",
  enviado: "bg-info/15 text-info border-info/30",
  pendente: "bg-warning/15 text-warning border-warning/30",
  cancelado: "bg-destructive/15 text-destructive border-destructive/30",
};

function OrdersPage() {
  const [search, setSearch] = useState("");

  const { data: oRows = [], isLoading } = useOrders(200) as any;

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return oRows;
    return oRows.filter((order) => {
      return [
        order.order_number,
        order.customer_name,
        order.status,
        order.order_type,
        order.payment_method,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [oRows, search]);

  const total = filteredOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const ticket = filteredOrders.length ? total / filteredOrders.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meus Pedidos</h1>
        <p className="text-sm text-muted-foreground">Pedidos reais carregados do Supabase.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total comprado" value={formatBRL(total)} delta={0} icon={ShoppingBag} accent="primary" />
        <StatCard label="Ticket médio" value={formatBRL(ticket)} delta={0} accent="info" />
        <StatCard label="Pedidos no mês" value={String(filteredOrders.length)} delta={0} accent="success" />
        <StatCard label="Em trânsito" value={String(filteredOrders.filter((o) => o.status === "enviado").length)} accent="warning" icon={Truck} />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60">
        <div className="p-4 flex flex-wrap items-center gap-2 border-b border-border/60">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por pedido, cliente, status..." className="pl-9 bg-muted/40" />
          </div>
          <Button variant="outline" size="sm" className="gap-2"><Filter className="h-3.5 w-3.5" /> Filtros</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-3.5 w-3.5" /> Exportar</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase tracking-wider">
              <tr className="border-b border-border/60">
                <th className="text-left font-medium px-4 py-3">Pedido</th>
                <th className="text-left font-medium px-4 py-3">Cliente</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-left font-medium px-4 py-3">Tipo</th>
                <th className="text-left font-medium px-4 py-3">Pagamento</th>
                <th className="text-right font-medium px-4 py-3">Total</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground animate-pulse">
                    Carregando pedidos...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{order.order_number || order.id}</td>
                    <td className="px-4 py-3">{order.customer_name || "-"}</td>
                    <td className="px-4 py-3"><Badge variant="outline" className={statusColors[String(order.status || "pendente")] || statusColors.pendente}>{order.status || "pendente"}</Badge></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{order.order_type || "-"}</td>
                    <td className="px-4 py-3 text-xs">{order.payment_method || "-"}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatBRL(Number(order.total_amount || 0))}</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs"><RotateCcw className="h-3 w-3" /> Reorder</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
