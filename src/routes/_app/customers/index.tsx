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
      const { data } = await supabase
        .from("customers")
        .select("id, user_id, usuario, id_comprador, qualification, status, telefone, created_at")
        .order("created_at", { ascending: false });
      setCustomers(data || []);
    })();
  }, []);

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          (qual === "all" || (c.qualification || "") === qual) &&
          (q === "" || getCustomerLabel(c).toLowerCase().includes(q.toLowerCase())),
      ),
    [q, qual, customers],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Distribuidores"
        subtitle={`${customers.length.toLocaleString("pt-BR")} registros · ${customers
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
          em atenção. <span className="text-muted-foreground">Use os filtros para priorização.</span>
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
                "rounded-md border border-border px-3 py-1.5 text-xs",
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
                <td className="px-4 py-3 text-right tabular-nums">-</td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">-</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.telefone || "-"}</td>
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
