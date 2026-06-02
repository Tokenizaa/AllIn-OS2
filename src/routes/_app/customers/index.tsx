import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Filter, Search, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/widgets/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";
import { cn } from "@/lib/utils";
import { getCustomerInitials, getCustomerLabel } from "@/lib/customer-label";

export const Route = createFileRoute("/_app/customers/")({ component: CustomersPage });

const statusStyles: Record<string, string> = {
  active: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  blocked: "bg-destructive/15 text-destructive border-destructive/30",
  churned: "bg-muted text-muted-foreground border-border",
};

function CustomersPage() {
  const [q, setQ] = useState("");
  const [qual, setQual] = useState<string>("all");
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: customersData }, { data: networkData }] = await Promise.all([
        supabase
          .from("customers")
          .select("id, user_id, usuario, id_comprador, nome_completo, plan_name, email, cpf, qualification, status, telefone, numero_pedidos, total_compras, created_at, customer_type, plan_id, cidade, estado")
          .order("created_at", { ascending: false }),
        supabase
          .from("network_relationships")
          .select("customer_id, sponsor_customer_id, level")
          .limit(1000),
      ]);

      // Contar diretos para cada customer
      const directCounts = new Map<string, number>();
      (networkData || []).forEach((n: any) => {
        if (n.sponsor_customer_id) {
          directCounts.set(n.sponsor_customer_id, (directCounts.get(n.sponsor_customer_id) || 0) + 1);
        }
      });

      // Encontrar nível de cada customer
      const customerLevels = new Map<string, number>();
      (networkData || []).forEach((n: any) => {
        customerLevels.set(n.customer_id, n.level);
      });

      // Enriquecer customers com dados de rede
      const enrichedCustomers = (customersData || []).map((c: any) => ({
        ...c,
        direct_count: directCounts.get(c.id) || 0,
        level: customerLevels.get(c.id) || 0,
      }));

      setCustomers(enrichedCustomers);
    })();
  }, []);

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          (qual === "all" || (c.plan_name || c.qualification || "") === qual) &&
          (q === "" || getCustomerLabel(c).toLowerCase().includes(q.toLowerCase())),
      ),
    [q, qual, customers],
  );

  const filterOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        customers
          .map((c) => c.plan_name || c.qualification)
          .filter((value): value is string => Boolean(value)),
      ),
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));

    return ["all", ...values];
  }, [customers]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Distribuidores"
        subtitle={`${customers.length.toLocaleString("pt-BR")} registros Â· ${customers
          .filter((c) => c.status === "active")
          .length.toLocaleString("pt-BR")} ativos`}
        actions={<Button size="sm">Novo distribuidor</Button>}
      />

      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex flex-wrap items-center gap-3">
        <Sparkles className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm flex-1 min-w-0">
          <span className="font-medium">
            {customers.filter((c) => (c.status || "") !== "active").length} distribuidores
          </span>{" "}
          em atenÃ§Ã£o. <span className="text-muted-foreground">Use os filtros para priorizaÃ§Ã£o.</span>
        </p>
        <Button size="sm" variant="outline">
          Atualizar base
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome completo ou identificação..."
            className="h-9 pl-8 bg-card/60"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {filterOptions.map((v) => (
            <button
              key={v}
              onClick={() => setQual(v)}
              className={cn(
                "rounded-md border border-border px-3 py-1.5 text-xs",
                qual === v
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/40 text-muted-foreground hover:text-foreground",
              )}
            >
              {v === "all" ? "Todos os planos" : v}
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
              <th className="px-4 py-2.5 font-medium">Tipo</th>
              <th className="px-4 py-2.5 font-medium">Plano</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium text-right">Diretos</th>
              <th className="px-4 py-2.5 font-medium text-right">Nível</th>
              <th className="px-4 py-2.5 font-medium text-right">Pedidos</th>
              <th className="px-4 py-2.5 font-medium text-right">LTV</th>
              <th className="px-4 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.slice(0, 40).map((c) => (
              <tr key={c.id} className="hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-500/40 grid place-items-center text-[11px] font-medium">
                      {getCustomerInitials(c)}
                    </div>
                    <div>
                      <Link to="/customers/$id" params={{ id: c.id }} className="font-medium hover:text-primary">
                        {getCustomerLabel(c)}
                      </Link>
                      <div className="text-[11px] text-muted-foreground">
                        {c.cidade || "-"} / {c.estado || "-"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={c.customer_type === "distribuidor" ? "default" : "secondary"} className="text-[10px] capitalize">
                    {c.customer_type || "-"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-[10px]">
                    {c.plan_name || c.qualification || "-"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-md border px-1.5 py-0.5 text-[10px] capitalize",
                      statusStyles[String(c.status || "pending").toLowerCase()] || statusStyles.pending,
                    )}
                  >
                    {String(c.status || "pending").toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-xs">{c.direct_count || 0}</td>
                <td className="px-4 py-3 text-right tabular-nums text-xs">G{c.level || 0}</td>
                <td className="px-4 py-3 text-right tabular-nums">{Number(c.numero_pedidos || 0).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">
                  {Number(c.total_compras || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/customers/$id"
                    params={{ id: c.id }}
                    className="inline-flex items-center gap-0.5 text-xs text-primary"
                  >
                    Abrir 360 <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

