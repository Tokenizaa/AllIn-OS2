import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, MapPin, Phone, Shield, Sparkles, Workflow } from "lucide-react";
import { PageHeader } from "@/components/widgets/page-header";
import { Timeline } from "@/components/widgets/timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KpiCard } from "@/components/widgets/kpi-card";
import { supabase } from "@/lib/supabase-client";
import { getCustomerInitials, getCustomerLabel } from "@/lib/customer-label";

export const Route = createFileRoute("/_app/customers/$id")({
  component: Customer360,
  loader: async ({ params }) => {
    const { data } = await supabase.from("customers").select("*").eq("id", params.id).maybeSingle();
    if (!data) throw notFound();
    return { customer: data };
  },
});

function Customer360() {
  const { customer: c } = Route.useLoaderData();
  const [orders, setOrders] = useState<any[]>([]);
  const [sponsor, setSponsor] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: orderData }, { data: sponsorData }] = await Promise.all([
        supabase.from("orders").select("*").eq("customer_id", c.id).order("created_at", { ascending: false }),
        c.patrocinador_comprador
          ? supabase.from("customers").select("*").eq("id_comprador", c.patrocinador_comprador).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      setOrders(orderData || []);
      setSponsor(sponsorData || null);
    })();
  }, [c.id, c.patrocinador_comprador]);

  const tl = [
    { id: "1", type: "note", title: "Cadastro carregado", description: "Dados reais do Supabase", at: c.created_at || new Date().toISOString() },
    ...orders.slice(0, 4).map((o, index) => ({
      id: String(index + 2),
      type: "order" as const,
      title: `Pedido ${o.numero_pedido || o.id}`,
      description: o.status_pedido || o.status || "-",
      at: o.created_at || new Date().toISOString(),
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/customers" className="hover:text-foreground">
          Distribuidores
        </Link>
        <span>/</span>
        <span className="text-foreground">{getCustomerLabel(c)}</span>
      </div>

      <PageHeader
        eyebrow="Customer 360"
        title={getCustomerLabel(c)}
        subtitle={`${c.plano_id || c.plan_id || "-"} · ${c.qualification || "-"} · ativo desde ${
          c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : "-"
        }`}
        actions={
          <>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Workflow className="h-3.5 w-3.5" /> Workflow
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Mensagem
            </Button>
            <Button size="sm">Ações</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 rounded-xl border border-border bg-card/60 p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-fuchsia-500 grid place-items-center text-lg font-semibold text-white">
              {getCustomerInitials(c)}
            </div>
            <div>
              <p className="font-semibold">{getCustomerLabel(c)}</p>
              <p className="text-xs text-muted-foreground">{c.id}</p>
            </div>
          </div>
          <div className="space-y-1.5 text-xs">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5" /> {c.user_id || c.id_comprador || "-"}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5" /> {c.telefone || "-"}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {c.cidade || "-"}/{c.estado || "-"}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-3.5 w-3.5" /> CPF {c.metadata?.cpf || "-"}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">{c.qualification || "-"}</Badge>
            <Badge variant="outline">{c.plano_id || c.plan_id || "-"}</Badge>
            <Badge variant="outline" className="capitalize">
              {c.status || "-"}
            </Badge>
          </div>
          {sponsor && (
            <div className="rounded-md border border-border bg-background/40 p-2 text-xs">
              <p className="text-muted-foreground">Patrocinador</p>
              <Link to="/customers/$id" params={{ id: sponsor.id }} className="font-medium hover:text-primary">
                {getCustomerLabel(sponsor)}
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="LTV" value="-" />
          <KpiCard label="Total comprado" value="-" hint={`${orders.length} pedidos`} />
          <KpiCard label="Pedidos" value={String(orders.length)} />
          <KpiCard label="Risco de churn" value="--" />
          <div className="col-span-2 md:col-span-4 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">Dados reais carregados do Supabase.</span> As recomendações podem ser
                reintroduzidas depois.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="bg-card/60 border border-border">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="orders">Pedidos ({orders.length})</TabsTrigger>
          <TabsTrigger value="wallet">Carteira</TabsTrigger>
          <TabsTrigger value="network">Rede</TabsTrigger>
          <TabsTrigger value="docs">Documentos</TabsTrigger>
          <TabsTrigger value="automations">Automações</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card/60 p-5">
            <h3 className="text-sm font-semibold mb-4">Timeline operacional</h3>
            <Timeline events={tl as any} />
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left">Pedido</th>
                  <th className="px-4 py-2.5 text-left">Status</th>
                  <th className="px-4 py-2.5 text-left">Pagamento</th>
                  <th className="px-4 py-2.5 text-right">Valor</th>
                  <th className="px-4 py-2.5 text-left">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-accent/30">
                    <td className="px-4 py-3 font-mono text-xs">{o.numero_pedido || o.id}</td>
                    <td className="px-4 py-3 capitalize">{o.status_pedido || o.status || "-"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {o.payment_method || "-"} · {o.payment_status || "-"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      R$ {(Number(o.valor_total_pedido || o.valor_total || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {o.created_at ? new Date(o.created_at).toLocaleDateString("pt-BR") : "-"}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Sem pedidos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="wallet" className="grid md:grid-cols-3 gap-4">
          <KpiCard label="Saldo carteira" value="--" />
          <KpiCard label="Bônus do mês" value="--" accent="success" />
          <KpiCard label="Comissões pendentes" value="--" accent="warning" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
