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

type WalletSummary = {
  balance?: number | null;
  available_balance?: number | null;
  frozen_balance?: number | null;
  currency?: string | null;
};

type BonusWalletSummary = {
  balance?: number | null;
  available_balance?: number | null;
  total_earned?: number | null;
  total_used?: number | null;
  currency?: string | null;
};

type PointsWalletSummary = {
  balance?: number | null;
  available_balance?: number | null;
  currency?: string | null;
};

export const Route = createFileRoute("/_app/customers/$id")({
  component: Customer360,
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("customers")
      .select("id, usuario, id_comprador, user_id, nome_completo, email, cpf, qualification, status, cidade, estado, telefone, metadata, plan_id, patrocinador_comprador, numero_pedidos, total_compras, data_ultima_compra, created_at")
      .eq("id", params.id)
      .maybeSingle();
    if (!data) throw notFound();
    return { customer: data };
  },
});

function Customer360() {
  const { customer: c } = Route.useLoaderData();
  const [orders, setOrders] = useState<any[]>([]);
  const [sponsor, setSponsor] = useState<any | null>(null);
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [bonusWallet, setBonusWallet] = useState<BonusWalletSummary | null>(null);
  const [pointsWallet, setPointsWallet] = useState<PointsWalletSummary | null>(null);
  const [network, setNetwork] = useState<any[]>([]);
  const [networkCustomers, setNetworkCustomers] = useState<Map<string, any>>(new Map());
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: orderData }, { data: sponsorData }] = await Promise.all([
        supabase
          .from("orders")
          .select("id, user_id, customer_id, numero_pedido, status_pedido, payment_method, payment_status, valor_total_pedido, id_comprador, usuario, comprador, patrocinador_comprador, data_criacao, updated_at")
          .eq("customer_id", c.id)
          .order("data_criacao", { ascending: false })
          .limit(50),
        c.patrocinador_comprador
          ? supabase.from("customers").select("id, usuario, id_comprador, user_id, qualification, status").eq("id_comprador", c.patrocinador_comprador).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      setOrders(orderData || []);
      setSponsor(sponsorData || null);

      const [walletRes, bonusRes, pointsRes, networkRes, auditRes, shipmentsRes] = await Promise.all([
        supabase.from("wallets").select("balance, available_balance, frozen_balance, currency").eq("customer_id", c.id).maybeSingle(),
        supabase.from("bonus_wallets").select("balance, available_balance, total_earned, total_used, currency").eq("customer_id", c.id).maybeSingle(),
        supabase.from("points_wallets").select("balance, available_balance, currency").eq("customer_id", c.id).maybeSingle(),
        supabase.from("network_relationships").select("customer_id, sponsor_customer_id, level, created_at").eq("sponsor_customer_id", c.id).order("level", { ascending: true }).limit(20),
        supabase.from("audit_log").select("id, action, entity_type, created_at, metadata").eq("user_id", c.user_id).order("created_at", { ascending: false }).limit(10),
        supabase.from("shipments").select("id, order_id, shipping_status, tracking_code, provider, shipped_at, delivered_at, created_at").in("order_id", (orderData || []).map((o) => o.id)).order("created_at", { ascending: false }).limit(10),
      ]);

      setWallet(walletRes.data || null);
      setBonusWallet(bonusRes.data || null);
      setPointsWallet(pointsRes.data || null);
      setNetwork(networkRes.data || []);
      setAuditLogs(auditRes.data || []);
      setShipments(shipmentsRes.data || []);

      // Buscar dados dos customers da rede
      const networkCustomerIds = (networkRes.data || []).map((n: any) => n.customer_id);
      if (networkCustomerIds.length > 0) {
        const { data: networkCustomersData } = await supabase
          .from("customers")
          .select("id, usuario, id_comprador, nome_completo, qualification, status")
          .in("id", networkCustomerIds);
        
        const customerMap = new Map();
        (networkCustomersData || []).forEach((cust: any) => {
          customerMap.set(cust.id, cust);
        });
        setNetworkCustomers(customerMap);
      }
    })();
  }, [c.id, c.user_id, c.patrocinador_comprador]);

  const tl = [
    { id: "1", type: "note", title: "Cadastro carregado", description: "Dados reais do Supabase", at: c.created_at || new Date().toISOString() },
    ...orders.slice(0, 4).map((o, index) => ({
      id: String(index + 2),
      type: "order" as const,
      title: `Pedido ${o.numero_pedido || o.id}`,
      description: o.status_pedido || o.status || "-",
      at: o.data_criacao || o.updated_at || new Date().toISOString(),
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
        subtitle={`${c.plan_id || "-"} · ${c.qualification || "-"} · ativo desde ${
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
              <Mail className="h-3.5 w-3.5" /> {c.email || c.user_id || c.id_comprador || "-"}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5" /> {c.telefone || "-"}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {c.cidade || "-"}/{c.estado || "-"}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-3.5 w-3.5" /> CPF {c.cpf || c.metadata?.cpf || "-"}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">{c.qualification || "-"}</Badge>
            <Badge variant="outline">{c.plan_id || "-"}</Badge>
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
          <KpiCard label="LTV" value={Number(c.total_compras || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
          <KpiCard label="Total comprado" value={Number(c.total_compras || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} hint={`${Number(c.numero_pedidos || orders.length).toLocaleString("pt-BR")} pedidos`} />
          <KpiCard label="Pedidos" value={String(c.numero_pedidos || orders.length)} />
          <KpiCard label="Risco de churn" value={orders.length >= 4 ? "Baixo" : orders.length >= 2 ? "Médio" : "Alto"} />
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
                      {o.payment_method || "-"} Â· {o.payment_status || "-"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      R$ {(Number(o.valor_total_pedido || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {o.data_criacao || o.updated_at ? new Date(o.data_criacao || o.updated_at).toLocaleDateString("pt-BR") : "-"}
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
          <KpiCard
            label="Saldo carteira"
            value={Number(wallet?.available_balance ?? wallet?.balance ?? 0).toLocaleString("pt-BR", { style: "currency", currency: wallet?.currency || "BRL" })}
            hint={`Bloqueado: ${Number(wallet?.frozen_balance ?? 0).toLocaleString("pt-BR", { style: "currency", currency: wallet?.currency || "BRL" })}`}
          />
          <KpiCard
            label="Bônus do mês"
            value={Number(bonusWallet?.available_balance ?? bonusWallet?.balance ?? 0).toLocaleString("pt-BR", { style: "currency", currency: bonusWallet?.currency || "BRL" })}
            hint={`Total ganho: ${Number(bonusWallet?.total_earned ?? 0).toLocaleString("pt-BR", { style: "currency", currency: bonusWallet?.currency || "BRL" })}`}
            accent="success"
          />
          <KpiCard
            label="Pontos disponíveis"
            value={Number(pointsWallet?.available_balance ?? pointsWallet?.balance ?? 0).toLocaleString("pt-BR")}
            hint={`Carteira de pontos ${pointsWallet?.currency || "PTS"}`}
            accent="warning"
          />
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left">Nível</th>
                  <th className="px-4 py-2.5 text-left">Membro da Rede</th>
                  <th className="px-4 py-2.5 text-left">Qualificação</th>
                  <th className="px-4 py-2.5 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {network.length > 0 ? network.map((row) => {
                  const customer = networkCustomers.get(row.customer_id);
                  return (
                    <tr key={`${row.customer_id}-${row.level}`} className="hover:bg-accent/30">
                      <td className="px-4 py-3">Geração {row.level ?? 0}</td>
                      <td className="px-4 py-3">
                        {customer ? (
                          <Link to="/customers/$id" params={{ id: customer.id }} className="font-medium hover:text-primary">
                            {getCustomerLabel(customer)}
                          </Link>
                        ) : (
                          <span className="font-mono text-xs">{row.customer_id}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-[10px]">
                          {customer?.qualification || "-"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={customer?.status === "active" ? "default" : "secondary"} className="text-[10px] capitalize">
                          {customer?.status || "-"}
                        </Badge>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-muted-foreground">
                      Nenhum membro na rede encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <div className="grid gap-4">
            <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Documento</th>
                    <th className="px-4 py-2.5 text-left">Status</th>
                    <th className="px-4 py-2.5 text-left">Atualização</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr className="hover:bg-accent/30">
                    <td className="px-4 py-3">CPF</td>
                    <td className="px-4 py-3">{c.cpf ? "Informado" : "Pendente"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.updated_at ? new Date(c.updated_at).toLocaleDateString("pt-BR") : "-"}</td>
                  </tr>
                  <tr className="hover:bg-accent/30">
                    <td className="px-4 py-3">Cadastro</td>
                    <td className="px-4 py-3">{c.status || "-"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Envio</th>
                    <th className="px-4 py-2.5 text-left">Status</th>
                    <th className="px-4 py-2.5 text-left">Código</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {shipments.length > 0 ? shipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-accent/30">
                      <td className="px-4 py-3">{shipment.provider || "Correios"}</td>
                      <td className="px-4 py-3">{shipment.shipping_status || "-"}</td>
                      <td className="px-4 py-3 font-mono text-xs">{shipment.tracking_code || "-"}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-sm text-muted-foreground">
                        Nenhum envio encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="automations" className="space-y-4">
          <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left">Evento</th>
                  <th className="px-4 py-2.5 text-left">Entidade</th>
                  <th className="px-4 py-2.5 text-left">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {auditLogs.length > 0 ? auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-accent/30">
                    <td className="px-4 py-3">{log.action || "-"}</td>
                    <td className="px-4 py-3">{log.entity_type || "-"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{log.created_at ? new Date(log.created_at).toLocaleDateString("pt-BR") : "-"}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-sm text-muted-foreground">
                      Nenhuma automação ou log disponível.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


