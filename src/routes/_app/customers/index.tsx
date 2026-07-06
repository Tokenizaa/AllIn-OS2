import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Search, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/widgets/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCustomerInitials, getCustomerLabel } from "@/lib/customer-label";
import { useCustomers } from "@/hooks/customers/useCustomers";

export const Route = createFileRoute("/_app/customers/")({ component: CustomersPage });

const statusStyles: Record<string, string> = {
  active: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  blocked: "bg-destructive/15 text-destructive border-destructive/30",
  churned: "bg-muted text-muted-foreground border-border",
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function CustomersPage() {
  const [q, setQ] = useState("");
  const [planoFilter, setPlanoFilter] = useState<string>("all");
  const [cidadeFilter, setCidadeFilter] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  const { data, isLoading, refetch } = useCustomers();

  const customers = useMemo(() => (data as any)?.customers || [], [data]);
  const orderStats = (data as any)?.orderStats || {};
  const totalCount = (data as any)?.totalCount || 0;

  // Filter to show only final customers (not distributors)
  const finalCustomers = useMemo(() => {
    return customers.filter((c: any) => !c.tipo_cliente || c.tipo_cliente !== 'distribuidor');
  }, [customers]);

  // Get unique values for filters
  const uniquePlanos = useMemo(() => {
    const planos = new Set(customers.map((c: any) => c.tipo_cliente).filter(Boolean));
    return Array.from(planos).sort();
  }, [customers]);

  const uniqueCidades = useMemo(() => {
    const cidades = new Set(customers.map((c: any) => c.cidade).filter(Boolean));
    return Array.from(cidades).sort();
  }, [customers]);

  // Reset page when queries/filters change to avoid being stranded
  useEffect(() => {
    setCurrentPage(1);
  }, [q, planoFilter, cidadeFilter]);

  const filtered = useMemo(
    () =>
      finalCustomers.filter(
        (c) =>
          (q === "" || getCustomerLabel(c).toLowerCase().includes(q.toLowerCase())) &&
          (planoFilter === "all" || c.tipo_cliente === planoFilter) &&
          (cidadeFilter === "all" || c.cidade === cidadeFilter),
      ),
    [q, planoFilter, cidadeFilter, finalCustomers],
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Clientes"
        subtitle={`${totalCount.toLocaleString("pt-BR")} registros · ${finalCustomers
          .filter((c) => c.status === "active")
          .length.toLocaleString("pt-BR")} ativos nesta página`}
        actions={<Button size="sm" onClick={() => refetch()}>Atualizar base</Button>}
      />

      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex flex-wrap items-center gap-3">
        <Sparkles className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm flex-1 min-w-0">
          <span className="font-medium">
            {finalCustomers.filter((c) => (c.status || "") !== "active").length} clientes
          </span>{" "}
          em atenção. <span className="text-muted-foreground">Use os filtros para priorização.</span>
        </p>
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          Recarregar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome ou identificação…"
            className="h-9 pl-8 bg-card/60"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap items-center">
          <select
            value={planoFilter}
            onChange={(e) => setPlanoFilter(e.target.value)}
            className="bg-card border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="all">Todos os tipos</option>
            {uniquePlanos.map((plano) => (
              <option key={plano} value={plano}>
                {plano}
              </option>
            ))}
          </select>
          <select
            value={cidadeFilter}
            onChange={(e) => setCidadeFilter(e.target.value)}
            className="bg-card border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="all">Todas as cidades</option>
            {uniqueCidades.map((cidade) => (
              <option key={cidade} value={cidade}>
                {cidade}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/40 text-left">
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Cliente</th>
              <th className="px-4 py-2.5 font-medium">Tipo</th>
              <th className="px-4 py-2.5 font-medium">Cidade</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium text-right">Pedidos</th>
              <th className="px-4 py-2.5 font-medium text-right">LTV</th>
              <th className="px-4 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, idx) => (
                <tr key={`skeleton-${idx}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                      <div className="space-y-1">
                        <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="h-4 w-8 bg-muted rounded animate-pulse ml-auto" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="h-4 w-14 bg-muted rounded animate-pulse ml-auto" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">
                  Nenhum cliente encontrado com os filtros atuais.
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const stats = orderStats[c.id] || { count: 0, ltv: 0 };
                return (
                  <tr key={c.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-500/40 grid place-items-center text-[11px] font-medium text-white shadow-sm">
                          {getCustomerInitials(c)}
                        </div>
                        <div>
                          <Link to="/_app/customers/$id" params={{ id: c.id }} className="font-medium hover:text-primary transition-colors">
                            {getCustomerLabel(c)}
                          </Link>
                          <div className="text-[11px] text-muted-foreground">{c.allin_id || c.id || "-"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground truncate max-w-[150px] block">
                        {c.tipo_cliente || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {c.cidade || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-md border px-1.5 py-0.5 text-[10px] capitalize",
                          statusStyles[c.status || "pending"],
                        )}
                      >
                        {c.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {stats.count.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-emerald-500">
                      {formatBRL(stats.ltv)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to="/_app/customers/$id"
                        params={{ id: c.id }}
                        className="inline-flex items-center gap-0.5 text-xs text-primary font-medium hover:underline"
                      >
                        Abrir 360 <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Dynamic Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/60 bg-background/20">
            <div className="text-xs text-muted-foreground">
              Exibindo <span className="font-semibold text-foreground">{Math.min(filtered.length, (currentPage - 1) * pageSize + 1)}</span> a{" "}
              <span className="font-semibold text-foreground">{Math.min(filtered.length, currentPage * pageSize)}</span> de{" "}
              <span className="font-semibold text-foreground">{totalCount}</span> clientes
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

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (currentPage > 3) {
                    pageNum = currentPage - 3 + i;
                  }
                  if (pageNum + (4 - i) > totalPages) {
                    pageNum = Math.max(1, totalPages - 4 + i);
                  }

                  if (pageNum > totalPages) return null;

                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      className="h-8 w-8 text-xs font-medium"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

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
