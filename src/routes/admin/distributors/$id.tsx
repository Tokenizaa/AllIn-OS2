import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomer360ByCustomerId } from "@/hooks/customers/useCustomer360New";
import { useCreateWallet } from "@/hooks/mutations/wallets/useCreateWallet";
import { useCreatePointsWallet } from "@/hooks/mutations/wallets/useCreatePointsWallet";
import { useUpdateWalletBalance } from "@/hooks/mutations/wallets/useUpdateWalletBalance";
import { useCreateWalletTransaction } from "@/hooks/mutations/wallets/useCreateWalletTransaction";
import { queryKeys } from "@/hooks/queryKeys";
import { CustomerDocumentsService } from "@/services/crm360";
import {
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Trash2,
  Upload,
  Users,
  Wallet,
  Coins,
  TrendingUp,
  Network,
  Trophy,
  Layers,
  Target,
  FileText,
  Calculator,
} from "lucide-react";
import { PageHeader } from "@/components/widgets/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KpiCard } from "@/components/widgets/kpi-card";
import { getCustomerInitials, getCustomerLabel } from "@/lib/customer-label";
import { Badge } from "@/components/ui/badge";
import { CustomerTimelineTab } from "@/components/customers/CustomerTimelineTab";
import { CustomerOrdersTab } from "@/components/customers/CustomerOrdersTab";
import { CustomerWalletTab } from "@/components/customers/CustomerWalletTab";
import { CustomerAutomationsTab } from "@/components/customers/CustomerAutomationsTab";
import { toast } from "sonner";
import { formatBRL } from "@/lib/customer-calculations";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  inactive: "bg-red-500/10 text-red-500/30 border-red-500/30",
  churned: "bg-muted text-muted-foreground border-border",
};

const EMPTY_LIST: any[] = [];

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export const Route = createFileRoute("/admin/distributors/$id")({
  component: Distributor360,
});

function Distributor360() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: queryData, isLoading, isError, error, refetch } = useCustomer360ByCustomerId(id);

  const createWallet = useCreateWallet();
  const createPointsWallet = useCreatePointsWallet();
  const updateWalletBalance = useUpdateWalletBalance();
  const createWalletTransaction = useCreateWalletTransaction();

  const customer = (queryData as any)?.customer;
  const orders = queryData?.orders ?? EMPTY_LIST;
  const sponsor = queryData?.sponsor || null;
  const wallet = queryData?.wallet || null;
  const pointsWallet = queryData?.pointsWallet || null;
  const walletTransactions = queryData?.walletTransactions ?? EMPTY_LIST;
  const downlines = queryData?.downlines ?? EMPTY_LIST;
  const customer360 = queryData;

  const [showAddTx, setShowAddTx] = useState(false);
  const [txType, setTxType] = useState<"credit" | "debit">("credit");
  const [txAmount, setTxAmount] = useState<string>("");
  const [txDesc, setTxDesc] = useState<string>("");

  const { data: documents = [], isLoading: docsLoading } = useQuery({
    queryKey: queryKeys.customer(id),
    queryFn: () => CustomerDocumentsService.fetchDocuments(id),
    enabled: !!id,
  });

  const docStatusMutation = useMutation({
    mutationFn: async ({ docId, status }: { docId: string; status: string }) => {
      await CustomerDocumentsService.updateDocumentStatus(docId, status);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer(id) });
      const messages: Record<string, string> = {
        approved: "Documento aprovado com sucesso.",
        rejected: "Documento rejeitado.",
        pending: "Documento enviado para análise.",
      };
      toast.success(messages[variables.status] || "Status atualizado.");
    },
    onError: () => {
      toast.error("Falha ao atualizar status do documento.");
    },
  });

  const ltv = useMemo(() => {
    return orders
      .filter((o) => ["pago", "entregue", "enviado"].includes((o.status_pedido || o.status || "").toLowerCase()))
      .reduce((acc, o) => acc + Number(o.valor_total_pedido || o.valor_total || 0), 0);
  }, [orders]);

  const totalComprado = useMemo(() => {
    return orders.reduce((acc, o) => acc + Number(o.valor_total_pedido || o.valor_total || 0), 0);
  }, [orders]);

  const churnRisk = useMemo(() => {
    if (!customer) return "N/A";
    if (customer.status === "inactive" || customer.status === "churned") return "95% (Crítico)";
    if (orders.length === 0) return "75% (Sem Compras)";
    
    const lastOrderDate = new Date(Math.max(...orders.map(o => new Date(o.created_at || 0).getTime())));
    const daysSinceLastOrder = (new Date().getTime() - lastOrderDate.getTime()) / (1000 * 3600 * 24);
    
    if (daysSinceLastOrder > 60) return "85% (Crítico - Inativo)";
    if (daysSinceLastOrder > 30) return "60% (Risco Médio)";
    if (daysSinceLastOrder > 15) return "35% (Alerta Leve)";
    return "12% (Estável / Baixo)";
  }, [customer?.status, orders]);

  const handleCreateWallet = () => {
    if (!customer) return;
    createWallet.mutate(customer.id, {
      onSuccess: () => refetch(),
    });
  };

  const handleCreatePointsWallet = () => {
    if (!customer) return;
    createPointsWallet.mutate(customer.id, {
      onSuccess: () => refetch(),
    });
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) {
      toast.error("Inicialize a carteira antes de lançar movimentações.");
      return;
    }
    const amt = parseFloat(txAmount);
    if (!amt || amt <= 0) {
      toast.error("Por favor, digite um valor numérico válido.");
      return;
    }

    const change = txType === "credit" ? amt : -amt;
    const balanceBefore = wallet.balance || 0;
    const balanceAfter = balanceBefore + change;

    updateWalletBalance.mutate(
      { walletId: wallet.id, balance: balanceAfter } as any,
      {
        onSuccess: () => {
          createWalletTransaction.mutate(
            {
              walletId: wallet.id,
              transaction_type: txType,
              amount: amt,
              balance_before: balanceBefore,
              balance_after: balanceAfter,
              description: txDesc || "Lançamento de ajuste administrativo",
            } as any,
            {
              onSuccess: () => {
                refetch();
                setTxAmount("");
                setTxDesc("");
                setShowAddTx(false);
              },
            }
          );
        },
      }
    );
  };

  const [noteText, setNoteText] = useState("");
  const [customNotes, setCustomNotes] = useState<any[]>([]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    const newNote = {
      id: "note-" + Date.now().toString(),
      text: noteText,
      author: "Admin",
      created_at: new Date().toISOString(),
    };
    setCustomNotes((prev) => [newNote, ...prev]);
    setNoteText("");
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <PageHeader eyebrow="MLM" title="Distribuidor 360°" subtitle="Carregando..." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-card/60 border border-border/60 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-card/60 border border-border/60 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <PageHeader eyebrow="MLM" title="Distribuidor 360°" subtitle="Falha ao carregar dados." />
        <p className="text-sm text-destructive">Erro: {(error as any)?.message || "falha desconhecida"}</p>
        <button className="text-sm underline" onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-3">
        <PageHeader eyebrow="MLM" title="Distribuidor 360°" subtitle="Distribuidor não encontrado." />
        <p className="text-sm text-muted-foreground">O registro solicitado não existe ou foi removido.</p>
      </div>
    );
  }

  const qualification = customer.qualification || "Afiliado";
  const graduation = customer.graduation || "Sem graduação";
  const idComprador = customer.id_comprador || customer.id.slice(0, 8).toUpperCase();
  const sponsorName = sponsor?.usuario || sponsor?.nome_completo || "Sem patrocinador";
  const sponsorComprador = sponsor?.id_comprador || "N/A";

  const directDownlines = downlines.filter((d: any) => d.patrocinador_comprador === customer.id_comprador);
  const totalDownlines = downlines.length;
  const activeDownlines = downlines.filter((d: any) => d.status === "active").length;

  const totalPointsEarned = useMemo(() => {
    return downlines.reduce((acc: number, d: any) => acc + Number(d.points_balance || d.pontos_acumulados || 0), 0);
  }, [downlines]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="MLM"
        title="Distribuidor 360°"
        subtitle={`${customer.usuario || customer.nome_completo || "Sem nome"} · ${idComprador} · ${qualification}`}
        actions={
          <Button size="sm" onClick={() => refetch()}>
            Atualizar
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="LTV (Vendas)"
          value={formatBRL(ltv)}
          icon={Wallet}
          trend="+12%"
          trendUp
        />
        <KpiCard
          title="Total Comprado"
          value={formatBRL(totalComprado)}
          icon={Coins}
        />
        <KpiCard
          title="Diretos Ativos"
          value={`${activeDownlines} / ${totalDownlines}`}
          icon={Users}
          trend={`${directDownlines.length} diretos`}
        />
        <KpiCard
          title="Pontos Acumulados"
          value={totalPointsEarned.toLocaleString("pt-BR")}
          icon={Target}
        />
        <KpiCard
          title="Churn Risk"
          value={churnRisk}
          icon={Shield}
          trend={customer.status === "active" ? "Estável" : "Atenção"}
          trendUp={customer.status === "active"}
        />
      </div>

      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
        <div className="p-4 border-b border-border/60 bg-background/30 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-500/40 grid place-items-center text-[16px] font-medium text-white shadow-sm">
              {getCustomerInitials(customer)}
            </div>
            <div className="min-w-0">
              <Link to="/admin/distributors/$id" params={{ id: customer.id }} className="font-semibold text-white hover:text-primary transition-colors truncate block">
                {getCustomerLabel(customer)}
              </Link>
              <div className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-2">
                <span className="font-mono">{idComprador}</span>
                <span>•</span>
                <Badge variant="outline" className="px-2 py-0.5 text-[10px]">{qualification}</Badge>
                <span>•</span>
                <Badge variant="outline" className="px-2 py-0.5 text-[10px]">{graduation}</Badge>
                <span>•</span>
                <span
                  className={cn(
                    "inline-flex rounded-md border px-1.5 py-0.5 text-[10px] capitalize",
                    statusStyles[customer.status || "pending"],
                  )}
                >
                  {customer.status || "pending"}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {customer.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {customer.email}
              </span>
            )}
            {customer.cidade && customer.estado && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {customer.cidade}/{customer.estado}
              </span>
            )}
            {customer.whatsapp || customer.telefone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {customer.whatsapp || customer.telefone}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-border/60 bg-background/20">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Patrocinador Direto</p>
            <p className="text-sm font-medium text-white truncate">{sponsorName}</p>
            <p className="text-[11px] text-muted-foreground font-mono">{sponsorComprador}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Cadastrado em</p>
            <p className="text-sm font-medium text-white">
              {customer.created_at ? new Date(customer.created_at).toLocaleDateString("pt-BR") : "-"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Última Compra</p>
            <p className="text-sm font-medium text-white">
              {orders.length > 0
                ? new Date(Math.max(...orders.map(o => new Date(o.created_at || 0).getTime()))).toLocaleDateString("pt-BR")
                : "Nunca"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Pedidos</p>
            <p className="text-sm font-medium text-white">{orders.length}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="network">Rede / Genealogia</TabsTrigger>
          <TabsTrigger value="commissions">Comissões</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="wallet">Carteira Financeira</TabsTrigger>
          <TabsTrigger value="points">Carteira Pontos</TabsTrigger>
          <TabsTrigger value="docs">Documentos</TabsTrigger>
          <TabsTrigger value="automations">Automações</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <CustomerTimelineTab customer={customer} orders={orders} />
        </TabsContent>

        <TabsContent value="network">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Genealogia - Downlines Diretas</h3>
                <p className="text-xs text-muted-foreground">Distribuidores cujo patrocinador direto é @{customer.id_comprador || customer.usuario}</p>
              </div>
              <Badge variant="outline" className="px-2.5 py-1 text-xs text-white border-white/20">
                {directDownlines.length} Diretos · {totalDownlines} Total Rede
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <KpiCard title="Diretos Ativos" value={activeDownlines} icon={Users} />
              <KpiCard title="Diretos Inativos" value={directDownlines.length - activeDownlines} icon={Users} />
              <KpiCard title="Pontos Totais Rede" value={totalPointsEarned.toLocaleString("pt-BR")} icon={Target} />
            </div>

            <div className="rounded-xl border border-border bg-card/45 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Distribuidor</th>
                    <th className="px-4 py-2.5 text-left">Código / ID com.</th>
                    <th className="px-4 py-2.5 text-left">Qualificação</th>
                    <th className="px-4 py-2.5 text-left">Status</th>
                    <th className="px-4 py-2.5 text-left">Cidade/UF</th>
                    <th className="px-4 py-2.5 text-left">Cadastro</th>
                    <th className="px-4 py-2.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-white/90">
                  {directDownlines.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2 py-4">
                          <Users className="h-8 w-8 text-muted-foreground/60" />
                          <p className="font-semibold text-foreground">Sem indicações diretas</p>
                          <span className="text-xs text-muted-foreground">Este distribuidor ainda não possui indicados diretos em sua rede de bônus.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    directDownlines.map((dl: any) => (
                      <tr key={dl.id} className="hover:bg-accent/30 transition-all">
                        <td className="px-4 py-3 font-semibold text-white">
                          {dl.usuario || "Distribuidor S/N"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {dl.id_comprador || dl.id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-[10px]">
                            {dl.qualification || "Afiliado"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "inline-flex rounded-md border px-1.5 py-0.5 text-[10px] capitalize",
                            statusStyles[dl.status || "pending"],
                          )}>
                            {dl.status || "pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {dl.cidade && dl.estado ? `${dl.cidade}/${dl.estado}` : "-"}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {dl.created_at ? new Date(dl.created_at).toLocaleDateString("pt-BR") : "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to="/admin/distributors/$id"
                            params={{ id: dl.id }}
                            className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-0.5"
                          >
                            Ver 360 <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-border bg-card/45 p-5">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Network className="h-4 w-4" />
                Visão Geral da Rede (Genealogia Completa)
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                Total de {totalDownlines} distribuidores na rede completa · {activeDownlines} ativos · {totalDownlines - activeDownlines} inativos
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 border border-border/60 rounded-lg bg-background/30">
                  <p className="text-2xl font-bold text-white">{totalDownlines}</p>
                  <p className="text-xs text-muted-foreground">Total na Rede</p>
                </div>
                <div className="p-3 border border-border/60 rounded-lg bg-background/30">
                  <p className="text-2xl font-bold text-emerald-400">{activeDownlines}</p>
                  <p className="text-xs text-muted-foreground">Ativos</p>
                </div>
                <div className="p-3 border border-border/60 rounded-lg bg-background/30">
                  <p className="text-2xl font-bold text-amber-400">{totalDownlines - activeDownlines}</p>
                  <p className="text-xs text-muted-foreground">Inativos</p>
                </div>
                <div className="p-3 border border-border/60 rounded-lg bg-background/30">
                  <p className="text-2xl font-bold text-primary">{totalPointsEarned.toLocaleString("pt-BR")}</p>
                  <p className="text-xs text-muted-foreground">Pontos Acumulados</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="commissions">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Histórico de Comissões</h3>
                <p className="text-xs text-muted-foreground">Comissões geradas, pagas e pendentes neste período</p>
              </div>
              <Badge variant="outline" className="px-2.5 py-1 text-xs text-white border-white/20">
                Implementar hook de comissões
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard title="Comissões Pagas" value="R$ 0,00" icon={Coins} />
              <KpiCard title="Comissões Pendentes" value="R$ 0,00" icon={Clock} />
              <KpiCard title="Comissões do Mês" value="R$ 0,00" icon={TrendingUp} />
              <KpiCard title="Total Vitalício" value="R$ 0,00" icon={Trophy} />
            </div>

            <div className="rounded-xl border border-border bg-card/45 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Data</th>
                    <th className="px-4 py-2.5 text-left">Tipo</th>
                    <th className="px-4 py-2.5 text-left">Origem</th>
                    <th className="px-4 py-2.5 text-left">Status</th>
                    <th className="px-4 py-2.5 text-right">Valor</th>
                    <th className="px-4 py-2.5 text-left">Referência</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <Calculator className="h-8 w-8 text-muted-foreground/60" />
                        <p className="font-semibold text-foreground">Nenhuma comissão registrada</p>
                        <span className="text-xs text-muted-foreground">As comissões aparecerão aqui quando processadas pelo motor MLM.</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <CustomerOrdersTab orders={orders} orderItems={customer360?.orderItems || []} products={customer360?.products || []} />
        </TabsContent>

        <TabsContent value="wallet">
          <CustomerWalletTab
            wallet={wallet}
            pointsWallet={pointsWallet}
            walletTransactions={walletTransactions}
            handleCreateWallet={handleCreateWallet}
            handleCreatePointsWallet={handleCreatePointsWallet}
            refetch={refetch}
          />
        </TabsContent>

        <TabsContent value="points">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Carteira de Pontos / Fidelidade</h3>
                <p className="text-xs text-muted-foreground">Pontos acumulados por compras, indicações e bônus de rede</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiCard
                title="Saldo Atual"
                value={pointsWallet ? formatBRL(pointsWallet.balance || 0) : "Não inicializada"}
                icon={Target}
              />
              <KpiCard
                title="Total Ganho"
                value={pointsWallet ? formatBRL(pointsWallet.total_earned || 0) : "0"}
                icon={TrendingUp}
              />
              <KpiCard
                title="Total Resgatado"
                value={pointsWallet ? formatBRL(pointsWallet.total_redeemed || 0) : "0"}
                icon={ArrowUpRight}
              />
            </div>

            {pointsWallet ? (
              <CustomerWalletTab
                wallet={pointsWallet}
                pointsWallet={null}
                walletTransactions={walletTransactions.filter((t: any) => t.wallet_type === "points")}
                handleCreateWallet={handleCreatePointsWallet}
                handleCreatePointsWallet={() => {}}
                refetch={refetch}
              />
            ) : (
              <div className="rounded-xl border border-border bg-card/45 p-6 text-center">
                <Target className="h-12 w-12 text-muted-foreground/60 mx-auto mb-3" />
                <p className="font-semibold text-white mb-1">Carteira de Pontos não inicializada</p>
                <p className="text-xs text-muted-foreground mb-4">Inicialize para começar a acumular pontos de fidelidade e bônus de rede</p>
                <Button onClick={handleCreatePointsWallet} className="mx-auto">
                  Inicializar Carteira de Pontos
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="docs">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Compliance Regulatório e Documentação</h3>
              <p className="text-xs text-muted-foreground">Controle, auditoria e validação de envios obrigatórios para garantir repasse legal e fiscal de comissões</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card/60 p-5 space-y-4 shadow-sm">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lista de Envio de Documentos</h4>
                
                <div className="space-y-3">
                  {documents.map((doc: any) => (
                    <div key={doc.id} className="p-3 border border-border bg-background/20 rounded-lg flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs truncate text-white">{doc.name}</span>
                          {doc.required && <Badge className="text-[9px] bg-red-500/15 text-red-450 border-red-500/30 shrink-0">Obrigatório</Badge>}
                        </div>
                        <div className="text-[10px] text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
                          <span>Tipo: {doc.type || "-"}</span>
                          {doc.updatedAt && (
                            <>
                              <span>•</span>
                              <span>Atualizado: {new Date(doc.updatedAt).toLocaleDateString("pt-BR")}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {doc.status === "approved" && (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Aprovado
                          </Badge>
                        )}
                        {doc.status === "pending" && (
                          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[10px] flex items-center gap-1">
                            <Clock className="h-3 w-3 animate-pulse" /> Pendente
                          </Badge>
                        )}
                        {doc.status === "missing" && (
                          <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/30 text-[10px]">
                            Não Enviado
                          </Badge>
                        )}
                        
                        <div className="flex gap-1">
                          {doc.status !== "approved" && (
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                              onClick={() => docStatusMutation.mutate({ docId: doc.id, status: "approved" })}
                              title="Aprovar Documento"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {doc.status !== "missing" && (
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              onClick={() => docStatusMutation.mutate({ docId: doc.id, status: "rejected" })}
                              title="Recusar / Excluir"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {doc.status === "missing" && (
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() => docStatusMutation.mutate({ docId: doc.id, status: "pending" })}
                              title="Enviar para Análise"
                            >
                              <Upload className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-xl border border-border bg-card/60 p-5 space-y-4 flex flex-col justify-between shadow-sm">
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-white">Compliance Geral de Cadastro</h4>
                  <div className="p-4 border border-border/60 bg-background/30 rounded-lg flex items-center gap-3">
                    <Shield className="h-10 w-10 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">Identidade Parcialmente Aprovada</p>
                      <p className="text-xs text-muted-foreground">Status atual autoriza o recebimento de comissões passivas de rede em pontos, mas bloqueia resgates monetários até aprovação da conta bancária e envio do comprovante de endereço.</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1.5 p-3 rounded-lg border border-border/40">
                    <p className="text-white"><strong>Notas de Compliance:</strong></p>
                    <p>1. O documento bancário deve estar no CPF/CNPJ titular cadastrado ({customer.metadata?.cpf || customer.cpf || "CPF ausente"}). Não são permitidos pagamentos para terceiros.</p>
                    <p>2. Os limites anuais de pagamento tributado são recalculados com base no envio do PIS/NIT para recolhimento de INSS.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="automations">
          <CustomerAutomationsTab customer={customer} />
        </TabsContent>
      </Tabs>
    </div>
  );
}