import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Filter, Search, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/widgets/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  const [qual, setQual] = useState<string>("all");
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  const { data, isLoading, refetch } = useCustomers();

  const customers = (data as any)?.customers || [];
  const orderStats = (data as any)?.orderStats || {};

  // Reset page when queries/filters change to avoid being stranded
  useEffect(() => {
    setCurrentPage(1);
  }, [q, qual]);

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          (qual === "all" || (c.qualification || "") === qual) &&
          (q === "" || getCustomerLabel(c).toLowerCase().includes(q.toLowerCase())),
      ),
    [q, qual, customers],
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filtered.slice(startIndex, startIndex + pageSize);
  }, [filtered, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Distribuidores"
        subtitle={`${customers.length.toLocaleString("pt-BR")} registros · ${customers
          .filter((c) => c.status === "active")
          .length.toLocaleString("pt-BR")} ativos`}
        actions={<Button size="sm" onClick={() => refetch()}>Atualizar base</Button>}
      />

      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex flex-wrap items-center gap-3">
        <Sparkles className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm flex-1 min-w-0">
          <span className="font-medium">
            {customers.filter((c) => (c.status || "") !== "active").length} distribuidores
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
        <div className="flex gap-1.5 flex-wrap">
          {["all", "Bronze", "Prata", "Ouro", "Diamante", "Black"].map((v) => (
            <button
              key={v}
              onClick={() => setQual(v)}
              className={cn(
                "rounded-md border border-border px-3 py-1.5 text-xs transition-all",
                qual === v
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/40 text-muted-foreground hover:text-foreground",
              )}
            >
              {v === "all" ? "Todas qualificações" : v}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="ml-auto gap-1.5">
          <Filter className="h-3.5 w-3.5" /> Mais filtros
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/40 text-left">
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Distribuidor</th>
              <th className="px-4 py-2.5 font-medium">Qualificação</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium text-right">Pedidos</th>
              <th className="px-4 py-2.5 font-medium text-right">LTV</th>
              <th className="px-4 py-2.5 font-medium">Telefone</th>
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
                    <div className="h-4 w-12 bg-muted rounded animate-pulse" />
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
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto" />
                  </td>
                </tr>
              ))
            ) : paginatedCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">
                  Nenhum distribuidor encontrado com os filtros atuais.
                </td>
              </tr>
            ) : (
              paginatedCustomers.map((c) => {
                const stats = orderStats[c.id] || { count: 0, ltv: 0 };
                return (
                  <tr key={c.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-500/40 grid place-items-center text-[11px] font-medium text-white shadow-sm">
                          {getCustomerInitials(c)}
                        </div>
                        <div>
                          <Link to="/customers/$id" params={{ id: c.id }} className="font-medium hover:text-primary transition-colors">
                            {getCustomerLabel(c)}
                          </Link>
                          <div className="text-[11px] text-muted-foreground">{c.id_comprador || c.user_id || "-"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px]">
                        {c.qualification || "-"}
                      </Badge>
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
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.telefone || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to="/customers/$id"
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
              <span className="font-semibold text-foreground">{filtered.length}</span> distribuidores
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
                      key={pageNum}
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
