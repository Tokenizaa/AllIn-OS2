import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/widgets/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { useOrderList } from "@/hooks/orders/useOrderList";

export const Route = createFileRoute("/_app/orders/")({ component: OrdersPage });

const statusColor: Record<string, string> = {
  pago: "bg-success/15 text-success border-success/30",
  pendente: "bg-warning/15 text-warning border-warning/30",
  enviado: "bg-info/15 text-info border-info/30",
  entregue: "bg-success/15 text-success border-success/30",
  cancelado: "bg-destructive/15 text-destructive border-destructive/30",
};

function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: ordersPageData, isLoading, isError, error, refetch } = useOrderList(currentPage, pageSize);

  const orders = ordersPageData?.orders || [];
  const customers = ordersPageData?.customers || [];
  const totalCount = ordersPageData?.totalCount || 0;

  const totalPages = Math.ceil(totalCount / pageSize);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const status = (o.status_pedido || o.status || "").toLowerCase();
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesSearch = searchQuery === "" || 
        (o.numero_pedido || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.id_comprador || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const total = filteredOrders.reduce((sum, o) => sum + Number(o.valor_total_pedido || o.valor_total || 0), 0);

  if (isError) {
    return (
      <div className="space-y-3">
        <PageHeader eyebrow="Comercial" title="Pedidos" subtitle="Falha ao carregar pedidos." />
        <p className="text-sm text-destructive">Erro: {error instanceof Error ? error.message : "falha desconhecida"}</p>
        <button className="text-sm underline" onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Comercial"
        title="Pedidos"
        subtitle={`${totalCount.toLocaleString("pt-BR")} pedidos no total · R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em receita bruta`}
      />
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por pedido ou cliente…"
            className="h-9 pl-8 bg-card/60"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", "pago", "pendente", "enviado", "entregue", "cancelado"].map((v) => (
            <button
              key={v}
              onClick={() => setStatusFilter(v)}
              className={`rounded-md border px-3 py-1.5 text-xs transition-all ${
                statusFilter === v
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {v === "all" ? "Todos status" : v}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="ml-auto gap-1.5">
          <Filter className="h-3.5 w-3.5" /> Mais filtros
        </Button>
      </div>
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
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground animate-pulse">
                  Carregando pedidos...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum pedido encontrado com os filtros atuais.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => {
                const customer = customers.find((x) => x.id === o.id_comprador);
                const customerLabel = (customer as any)?.name || customer?.usuario || customer?.id_comprador || customer?.user_id || customer?.id || o.id_comprador;
                return (
                  <tr key={o.id} className="hover:bg-accent/30">
                    <td className="px-4 py-3 font-mono text-xs">{o.numero_pedido || o.id}</td>
                    <td className="px-4 py-3">
                      {customer ? (
                        <Link to="/customers/$id" params={{ id: customer.id }} className="hover:text-primary">
                          {customerLabel}
                        </Link>
                      ) : (
                        o.id_comprador || "-"
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
              })
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/60 bg-background/20">
            <div className="text-xs text-muted-foreground">
              Exibindo <span className="font-semibold text-foreground">{Math.min(filteredOrders.length, (currentPage - 1) * pageSize + 1)}</span> a{" "}
              <span className="font-semibold text-foreground">{Math.min(filteredOrders.length, currentPage * pageSize)}</span> de{" "}
              <span className="font-semibold text-foreground">{filteredOrders.length}</span> pedidos
              {statusFilter !== "all" || searchQuery !== "" ? ` (filtrados de ${totalCount.toLocaleString("pt-BR")})` : ""}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Itens por página:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-card border border-border rounded-md px-2 py-1 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  {[10, 15, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-xs text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
