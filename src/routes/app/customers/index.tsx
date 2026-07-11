import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search, Sparkles, ChevronDown, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/widgets/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCustomerInitials, getCustomerLabel } from "@/lib/customer-label";
import { useCustomerListInfinite } from "@/hooks/customers/useCustomerListInfinite";

export const Route = createFileRoute("/app/customers/")({ component: CustomersPage });

const statusStyles: Record<string, string> = {
  active: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  blocked: "bg-destructive/15 text-destructive border-destructive/30",
  churned: "bg-muted text-muted-foreground border-border",
};

const PAGE_SIZE = 15;

function CustomersPage() {
  const [q, setQ] = useState("");

  const {
    customers,
    totalCount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
  } = useCustomerListInfinite(PAGE_SIZE);

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          (q === "" || getCustomerLabel(c).toLowerCase().includes(q.toLowerCase())),
      ),
    [q, customers],
  );

  const activeCount = useMemo(() => customers.filter((c) => c.status === "active").length, [customers]);
  const attentionCount = useMemo(() => customers.filter((c) => (c.status || "") !== "active").length, [customers]);

  if (isError) {
    return (
      <div className="space-y-3">
        <PageHeader eyebrow="CRM" title="Clientes" subtitle="Falha ao carregar clientes." />
        <p className="text-sm text-destructive">Erro: {(error as any)?.message || "falha desconhecida"}</p>
        <button className="text-sm underline" onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Clientes"
        subtitle={`${totalCount.toLocaleString("pt-BR")} registros · ${activeCount.toLocaleString("pt-BR")} ativos`}
        actions={<Button size="sm" onClick={() => refetch()}>Atualizar base</Button>}
      />

      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex flex-wrap items-center gap-3">
        <Sparkles className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm flex-1 min-w-0">
          <span className="font-medium">{attentionCount.toLocaleString("pt-BR")} clientes</span>{" "}
          em atenção.
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
      </div>

      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/40 text-left">
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Cliente</th>
              <th className="px-4 py-2.5 font-medium">Tipo</th>
              <th className="px-4 py-2.5 font-medium">Cidade</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
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
                  <td className="px-4 py-3"><div className="h-4 w-20 bg-muted rounded animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-16 bg-muted rounded animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-16 bg-muted rounded animate-pulse" /></td>
                  <td className="px-4 py-3 text-right"><div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">
                  Nenhum cliente encontrado com os filtros atuais.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-500/40 grid place-items-center text-[11px] font-medium text-white shadow-sm">
                        {getCustomerInitials(c)}
                      </div>
                      <div>
                        <Link to="/app/customers/$id" params={{ id: c.id }} className="font-medium hover:text-primary transition-colors">
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
                    <span className="text-xs text-muted-foreground">{c.cidade || "-"}</span>
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
                  <td className="px-4 py-3 text-right">
                    <Link
                      to="/app/customers/$id"
                      params={{ id: c.id }}
                      className="inline-flex items-center gap-0.5 text-xs text-primary font-medium hover:underline"
                    >
                      Abrir 360 <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!isLoading && customers.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-border/60 bg-background/20">
            <div className="text-xs text-muted-foreground">
              Exibindo <span className="font-semibold text-foreground">{customers.length.toLocaleString("pt-BR")}</span> de{" "}
              <span className="font-semibold text-foreground">{totalCount.toLocaleString("pt-BR")}</span> clientes totais
              {q !== "" ? ` (${filtered.length} com filtros atuais)` : ""}
            </div>

            {hasNextPage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="gap-2"
              >
                {isFetchingNextPage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                Carregar mais
              </Button>
            )}

            {!hasNextPage && (
              <span className="text-xs text-muted-foreground">Todos os clientes carregados</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
