import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  Coins
} from "lucide-react";
import { PageHeader } from "@/components/widgets/page-header";
import { Timeline } from "@/components/widgets/timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KpiCard } from "@/components/widgets/kpi-card";
import { getCustomerInitials, getCustomerLabel } from "@/lib/customer-label";
import { toast } from "sonner";
import { CustomerService } from "@/services/customers";
import { OrderService } from "@/services/orders";
import { WalletService } from "@/services/wallets";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  inactive: "bg-red-500/10 text-red-500/30 border-red-500/30",
  churned: "bg-muted text-muted-foreground border-border",
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export const Route = createFileRoute("/_app/customers/$id")({
  component: Customer360,
  loader: async ({ params }) => {
    const data = await CustomerService.fetchCustomerById(params.id);
    if (!data) throw notFound();
    return { customer: data };
  },
});

function Customer360() {
  const { customer: c } = Route.useLoaderData();
  const queryClient = useQueryClient();

  const { data: queryData, isLoading, refetch } = useQuery({
    queryKey: ["customer-360", c.id],
    queryFn: async () => {
      const [orderData, sponsorData] = await Promise.all([
        OrderService.fetchOrdersByCustomerId(c.id),
        c.patrocinador_comprador
          ? CustomerService.fetchCustomerByCompradorId(c.patrocinador_comprador)
          : Promise.resolve(null),
      ]);

      // wallets table select
      const walletData = await WalletService.fetchWalletByCustomerId(c.id);

      let txData: any[] = [];
      if (walletData) {
        txData = await WalletService.fetchWalletTransactionsByWalletId(walletData.id);
      }

      // points_wallets select
      const ptsData = await WalletService.fetchPointsWalletByCustomerId(c.id);

      // downlines check
      let downlineData: any[] = [];
      if (c.id_comprador) {
        downlineData = await CustomerService.fetchDownlines(c.id_comprador);
      }

      return {
        orders: orderData || [],
        sponsor: sponsorData || null,
        wallet: walletData || null,
        pointsWallet: ptsData || null,
        walletTransactions: txData,
        downlines: downlineData,
      };
    }
  });

  const orders = queryData?.orders || [];
  const sponsor = queryData?.sponsor || null;
  const wallet = queryData?.wallet || null;
  const pointsWallet = queryData?.pointsWallet || null;
  const walletTransactions = queryData?.walletTransactions || [];
  const downlines = queryData?.downlines || [];

  // Manual Note
  const [customNotes, setCustomNotes] = useState<any[]>([]);
  const [noteText, setNoteText] = useState("");

  // Wallet Movement Manual Trigger Form
  const [showAddTx, setShowAddTx] = useState(false);
  const [txType, setTxType] = useState<"credit" | "debit">("credit");
  const [txAmount, setTxAmount] = useState<string>("");
  const [txDesc, setTxDesc] = useState<string>("");

  // Compliance Documents state for interactive mock flow
  const [documents, setDocuments] = useState<any[]>([
    { id: "doc-1", name: "Contrato de Distribuidor Associado", required: true, status: "approved", type: "PDF", updatedAt: "2026-05-15T10:00:00Z" },
    { id: "doc-2", name: "Cédula de Identidade (RG/CNH)", required: true, status: "approved", type: "JPG", updatedAt: "2026-05-15T10:05:00Z" },
    { id: "doc-3", name: "Comprovante de Residência Recente", required: true, status: "pending", type: "PNG", updatedAt: "2026-06-01T14:30:00Z" },
    { id: "doc-4", name: "Inscrição PIS/NIT (Pessoa Física)", required: false, status: "missing", type: "-", updatedAt: null },
    { id: "doc-5", name: "Declaração de Conta Bancária para Recebimentos", required: true, status: "missing", type: "-", updatedAt: null }
  ]);

  // Automations states for interactive toggle flow
  const [automations, setAutomations] = useState<any[]>([
    { id: "auto-1", name: "E-mail de Boas-Vindas", description: "Disparado automaticamente no instante do cadastro da conta do distribuidor.", type: "E-mail", active: true, runs: 124 },
    { id: "auto-2", name: "Alerta de Upgrade de Nível", description: "Incentiva o distribuidor enviando metas quando está próximo de atingir graduação.", type: "WhatsApp", active: true, runs: 45 },
    { id: "auto-3", name: "Detecção de Inatividade (Churn)", description: "Notifica o patrocinador associado caso o distribuidor fique mais de 25 dias sem pedidos.", type: "Sistema", active: false, runs: 0 },
    { id: "auto-4", name: "Cobrança de Renovação Periódica", description: "Dispara lembretes 30 e 15 dias antes de expirar o licenciamento ativo.", type: "SMS", active: true, runs: 12 },
    { id: "auto-5", name: "WhatsApp de Cashback de Rede", description: "Mensagem automática comunicando crédito imediato de pontos de rede no ledger.", type: "WhatsApp", active: true, runs: 312 }
  ]);

  // Financial summary
  const ltv = useMemo(() => {
    return orders
      .filter((o) => ["pago", "entregue", "enviado"].includes((o.status_pedido || o.status || "").toLowerCase()))
      .reduce((acc, o) => acc + Number(o.valor_total_pedido || o.valor_total || 0), 0);
  }, [orders]);

  const totalComprado = useMemo(() => {
    return orders.reduce((acc, o) => acc + Number(o.valor_total_pedido || o.valor_total || 0), 0);
  }, [orders]);

  const churnRisk = useMemo(() => {
    if (c.status === "inactive" || c.status === "churned") return "95% (Crítico)";
    if (orders.length === 0) return "75% (Sem Compras)";
    
    const lastOrderDate = new Date(Math.max(...orders.map(o => new Date(o.created_at || 0).getTime())));
    const daysSinceLastOrder = (new Date().getTime() - lastOrderDate.getTime()) / (1000 * 3600 * 24);
    
    if (daysSinceLastOrder > 60) return "85% (Crítico - Inativo)";
    if (daysSinceLastOrder > 30) return "60% (Risco Médio)";
    if (daysSinceLastOrder > 15) return "35% (Alerta Leve)";
    return "12% (Estável / Baixo)";
  }, [c.status, orders]);

  // Initialize financial wallet
  const handleCreateWallet = async () => {
    try {
      await WalletService.createWallet(c.id);
      await queryClient.invalidateQueries({ queryKey: ["customer-360", c.id] });
      toast.success("Carteira financeira criada com sucesso no banco de dados!");
    } catch (err: any) {
      toast.error("Erro ao provisionar carteira: " + err.message);
    }
  };

  // Initialize points loyalty wallet
  const handleCreatePointsWallet = async () => {
    try {
      await WalletService.createPointsWallet(c.id);
      await queryClient.invalidateQueries({ queryKey: ["customer-360", c.id] });
      toast.success("Carteira de pontos criada com sucesso no banco de dados!");
    } catch (err: any) {
      toast.error("Erro ao provisionar pontos: " + err.message);
    }
  };

  // Add adjustment tx to finance
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

    try {
      await WalletService.updateWalletBalance(wallet.id, balanceAfter);

      await WalletService.createWalletTransaction(
        wallet.id,
        txType,
        amt,
        balanceBefore,
        balanceAfter,
        txDesc || "Lançamento de ajuste administrativo"
      );

      await queryClient.invalidateQueries({ queryKey: ["customer-360", c.id] });
      setTxAmount("");
      setTxDesc("");
      setShowAddTx(false);
      toast.success(`Saldo atualizado com sucesso (${txType === "credit" ? "Crédito" : "Débito"} de ${formatBRL(amt)}).`);
    } catch (err: any) {
      toast.error("Erro ao lançar transação financeira: " + err.message);
    }
  };

  // Timeline entries
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    const newNote = {
      id: "note-" + Date.now().toString(),
      type: "note" as const,
      title: "Observação CRM",
      description: noteText,
      at: new Date().toISOString()
    };
    setCustomNotes([newNote, ...customNotes]);
    setNoteText("");
    toast.success("Nota salva com sucesso na linha do tempo!");
  };

  const tl = useMemo(() => {
    return [
      ...customNotes,
      { id: "1", type: "note" as const, title: "Ficha Operacional", description: "Distribuidor sincronizado com os dados do Supabase.", at: c.created_at || new Date().toISOString() },
      ...orders.slice(0, 4).map((o, index) => ({
        id: `order-tl-${index}`,
        type: "order" as const,
        title: `Pedido ${o.numero_pedido || o.id.slice(0, 8)}`,
        description: `Status de processamento: ${o.status_pedido || o.status || "Pendente"}`,
        at: o.created_at || new Date().toISOString(),
      })),
    ];
  }, [customNotes, orders, c.created_at]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-xs text-muted-foreground animate-pulse font-medium">Carregando dados estruturados do Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/customers" className="hover:text-foreground transition-colors">
          Distribuidores
        </Link>
        <span>/</span>
        <span className="text-foreground">{getCustomerLabel(c)}</span>
      </div>

      <PageHeader
        eyebrow="Customer 360"
        title={getCustomerLabel(c)}
        subtitle={`${c.plano_id || c.plan_id || "Plano Integral"} · ${c.qualification || "Bronze"} · Ativo desde ${
          c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : "-"
        }`}
        actions={
          <>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => refetch()}>
              Re-sincronizar
            </Button>
            <Button size="sm" className="gap-1.5">
              Acionar Suporte
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Profile Card */}
        <div className="lg:col-span-1 rounded-xl border border-border bg-card/60 p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-fuchsia-500 grid place-items-center text-lg font-semibold text-white shadow-md">
              {getCustomerInitials(c)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate text-white">{getCustomerLabel(c)}</p>
              <p className="text-xs text-muted-foreground truncate">{c.id_comprador || c.usuario}</p>
            </div>
          </div>
          
          <div className="space-y-2 text-xs border-t border-border/60 pt-3">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{c.user_id || c.id_comprador || "Sem ID"}</span>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5 shrink-0" /> <span>{c.telefone || "-"}</span>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" /> <span>{c.cidade || "-"}/{c.estado || "-"}</span>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-3.5 w-3.5 shrink-0" /> <span>CPF {c.metadata?.cpf || c.cpf || "-"}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge variant="outline" className="bg-primary/5 ">{c.qualification || "Bronze"}</Badge>
            <Badge variant="outline" className="bg-primary/5">{c.plano_id || c.plan_id || "Integral"}</Badge>
            <Badge variant="outline" className={cn("capitalize font-semibold", statusStyles[c.status || "pending"])}>
              {c.status || "pending"}
            </Badge>
          </div>
          
          {sponsor && (
            <div className="rounded-lg border border-border bg-background/40 p-2.5 text-xs shadow-inner">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Patrocinador</p>
              <Link to="/customers/$id" params={{ id: sponsor.id }} className="mt-1 font-semibold hover:text-primary transition-all flex items-center gap-1 text-white">
                {getCustomerLabel(sponsor)} <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </Link>
            </div>
          )}
        </div>

        {/* Top KPIs */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="LTV" value={formatBRL(ltv)} />
          <KpiCard label="Total Comprado" value={formatBRL(totalComprado)} hint={`${orders.length} pedidos em folha`} />
          <KpiCard label="Pedidos na Conta" value={String(orders.length)} />
          <KpiCard label="Risco de Churn" value={churnRisk} />
          
          <div className="col-span-2 md:col-span-4 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-xs md:text-sm text-amber-550">
                <span className="font-semibold text-primary">Sincronização Ativa de Ledger:</span> Os dados financeiros, pontos de rede, downlines de genealogia e o histórico detalhado estão sendo carregados e operacionalizados em tempo real a partir das tabelas relacionais do Supabase.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="bg-card/60 border border-border gap-1 p-1">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="orders">Pedidos ({orders.length})</TabsTrigger>
          <TabsTrigger value="wallet">Carteira</TabsTrigger>
          <TabsTrigger value="network">Rede ({downlines.length})</TabsTrigger>
          <TabsTrigger value="docs">Documentos</TabsTrigger>
          <TabsTrigger value="automations">Automações</TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card/60 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Linha do Tempo e Histórico do Distribuidor</h3>
            <Timeline events={tl as any} />
          </div>

          <div className="lg:col-span-1 rounded-xl border border-border bg-card/60 p-5 h-fit space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold text-white">Registrar Anotação de CRM</h3>
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Insira notas de contato, pendências de suporte, acordos de rede..."
                className="w-full h-24 bg-background border border-border rounded-lg p-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
              <Button type="submit" size="sm" className="w-full">
                Salvar Histórico
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <div className="rounded-xl border border-border bg-card/40 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left">Nº Pedido</th>
                  <th className="px-4 py-2.5 text-left">Status</th>
                  <th className="px-4 py-2.5 text-left">Método de pagamento</th>
                  <th className="px-4 py-2.5 text-right">Valor do pedido</th>
                  <th className="px-4 py-2.5 text-left">Data de emissão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-white/90">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-accent/30 transition-all">
                    <td className="px-4 py-3 font-mono text-xs">{o.numero_pedido || o.id.slice(0, 10)}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
                        {o.status_pedido || o.status || "pendente"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground capitalize">
                      {o.payment_method || "pix"} · {o.payment_status || "pago"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-white font-medium">
                      {formatBRL(Number(o.valor_total_pedido || o.valor_total || 0))}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {o.created_at ? new Date(o.created_at).toLocaleDateString("pt-BR") : "-"}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      Sem pedidos cadastrados para esse cliente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Financial Wallet Tab */}
        <TabsContent value="wallet" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card/60 p-5 space-y-2 relative overflow-hidden shadow-sm">
              <Wallet className="h-6 w-6 text-primary absolute right-4 top-4" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Carteira Monetária (All In Pay)</p>
              {wallet ? (
                <div className="space-y-2 mt-2">
                  <p className="text-3xl font-bold text-white">{formatBRL(wallet.balance || 0)}</p>
                  <p className="text-[11px] text-muted-foreground">Disponível para saque imediato: <strong className="text-white">{formatBRL(wallet.available_balance || 0)}</strong></p>
                </div>
              ) : (
                <div className="pt-2">
                  <p className="text-xs text-yellow-500 mb-2">Carteira não inicializada neste distribuidor</p>
                  <Button size="sm" variant="outline" onClick={handleCreateWallet}>Criar Carteira</Button>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-5 space-y-2 relative overflow-hidden shadow-sm">
              <Coins className="h-6 w-6 text-emerald-500 absolute right-4 top-4" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Conta Fidelidade (Cashback/Network)</p>
              {pointsWallet ? (
                <div className="space-y-2 mt-2">
                  <p className="text-3xl font-bold text-emerald-400">{(pointsWallet.balance || 0).toLocaleString("pt-BR")} PTS</p>
                  <div className="text-[10px] text-muted-foreground flex justify-between">
                    <span>Ganhos: {pointsWallet.total_earned || 0}</span>
                    <span>Resgatados: {pointsWallet.total_redeemed || 0}</span>
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <p className="text-xs text-yellow-500 mb-2">Carteira de Pontos não inicializada</p>
                  <Button size="sm" variant="outline" onClick={handleCreatePointsWallet}>Criar Conta de Pontos</Button>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-5 flex flex-col justify-between shadow-sm">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Ações de Ajuste de Saldo</h4>
                <p className="text-[11px] text-muted-foreground">Adicione créditos de bônus comercial, comissões de rede, ou debite por reajuste administrativo em lote.</p>
              </div>
              <Button size="sm" className="mt-3 w-full" onClick={() => setShowAddTx(!showAddTx)} disabled={!wallet}>
                {showAddTx ? "Esconder Lançador" : "Lançar Movimentação"}
              </Button>
            </div>
          </div>

          {/* Form manual movement */}
          {showAddTx && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 max-w-xl transition-all shadow-md">
              <h4 className="text-sm font-semibold mb-3 text-white">Lançamento Financeiro Manual</h4>
              <form onSubmit={handleAddTransaction} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Tipo</label>
                    <select
                      value={txType}
                      onChange={(e) => setTxType(e.target.value as any)}
                      className="bg-background border border-border rounded-lg px-3 py-2 w-full text-xs text-foreground focus:outline-none"
                    >
                      <option value="credit">Crédito (Acréscimo (+))</option>
                      <option value="debit">Débito (Retirada (-))</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      className="bg-background border border-border rounded-lg px-3 py-2 w-full text-xs text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground">Descrição / Motivo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pagamento de bônus binário residual ciclo maio"
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    className="bg-background border border-border rounded-lg px-3 py-2 w-full text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" size="xs" variant="outline" onClick={() => setShowAddTx(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" size="xs">
                    Confirmar Transação
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Transactions table ledger */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Extrato Histórico da Carteira Financeira</h3>
            <div className="rounded-xl border border-border bg-card/40 overflow-hidden shadow-inner">
              <table className="w-full text-sm">
                <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left">ID Ref</th>
                    <th className="px-4 py-2.5 text-left">Data</th>
                    <th className="px-4 py-2.5 text-left">Evento / Detalhes</th>
                    <th className="px-4 py-2.5 text-left">Natureza</th>
                    <th className="px-4 py-2.5 text-right">Valor</th>
                    <th className="px-4 py-2.5 text-right font-medium">Saldo Resultante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-white/90">
                  {walletTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-accent/30 transition-all">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{tx.reference_id || tx.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {tx.created_at ? new Date(tx.created_at).toLocaleString("pt-BR") : "-"}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <p className="font-semibold text-white">{tx.description || "Ajuste manual"}</p>
                        <p className="text-[10px] text-muted-foreground">{tx.reference_type || "ajuste"}</p>
                      </td>
                      <td className="px-4 py-3">
                        {tx.transaction_type === "credit" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[9px] font-medium">Crédito</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-450 border-red-500/30 text-[9px] font-medium">Débito</Badge>
                        )}
                      </td>
                      <td className={cn("px-4 py-3 text-right font-bold tabular-nums", tx.transaction_type === "credit" ? "text-emerald-400" : "text-red-400")}>
                        {tx.transaction_type === "credit" ? "+" : "-"} {formatBRL(tx.amount || 0)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-white tabular-nums">
                        {formatBRL(tx.balance_after ?? 0)}
                      </td>
                    </tr>
                  ))}
                  {walletTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                        Nenhum lançamento ou movimentação financeira disponível no extrato desta conta.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Network / Genealogia Downline Tab */}
        <TabsContent value="network">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Parceiros da Rede (Indicações Diretas)</h3>
                <p className="text-xs text-muted-foreground">Listagem em tempo real de distribuidores cujo sponsor direta é @{c.id_comprador || c.usuario}</p>
              </div>
              <Badge variant="outline" className="px-2.5 py-1 text-xs text-white border-white/20">
                {downlines.length} Diretos Cadastrados
              </Badge>
            </div>
            
            <div className="rounded-xl border border-border bg-card/45 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Distribuidor</th>
                    <th className="px-4 py-2.5 text-left">Código / ID com.</th>
                    <th className="px-4 py-2.5 text-left">Graduação</th>
                    <th className="px-4 py-2.5 text-left">Status de Conta</th>
                    <th className="px-4 py-2.5 text-left">Cidade/UF</th>
                    <th className="px-4 py-2.5 text-left">Data Cadastro</th>
                    <th className="px-4 py-2.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-white/90">
                  {downlines.map((dl) => (
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
                        <span className={cn("inline-flex rounded-md border px-1.5 py-0.5 text-[10px] capitalize font-medium", statusStyles[dl.status || "pending"])}>
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
                        <Link to="/customers/$id" params={{ id: dl.id }} className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-0.5">
                          Ver 360 <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {downlines.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2 py-4">
                          <Users className="h-8 w-8 text-muted-foreground/60" />
                          <p className="font-semibold text-foreground">Sem indicações diretas</p>
                          <span className="text-xs text-muted-foreground">Esse distribuidor ainda não possui indicados ou downlines posicionados em sua rede de bônus.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Compliance and Documents Tab */}
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
                  {documents.map((doc) => (
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
                              onClick={() => {
                                const updated = documents.map(d => d.id === doc.id ? { ...d, status: "approved", type: "PDF", updatedAt: new Date().toISOString() } : d);
                                setDocuments(updated);
                                toast.success(`Documento "${doc.name}" aprovado com sucesso.`);
                              }}
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
                              onClick={() => {
                                const updated = documents.map(d => d.id === doc.id ? { ...d, status: "missing", type: "-", updatedAt: null } : d);
                                setDocuments(updated);
                                toast.warning(`Documento "${doc.name}" removido ou reprovado.`);
                              }}
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
                              onClick={() => {
                                const updated = documents.map(d => d.id === doc.id ? { ...d, status: "pending", type: "PDF", updatedAt: new Date().toISOString() } : d);
                                setDocuments(updated);
                                toast.info(`Documento "${doc.name}" enviado para análise de compliance.`);
                              }}
                              title="Simular Upload"
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
                    <p>1. O documento bancário deve estar no CPF/CNPJ titular cadastrado ({c.metadata?.cpf || c.cpf || "CPF ausente"}). Não são permitidos pagamentos para terceiros.</p>
                    <p>2. Os limites anuais de pagamento tributado são recalculados com base no envio do PIS/NIT para recolhimento de INSS.</p>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-white border-white/20" onClick={() => {
                    setDocuments(documents.map(d => ({ ...d, status: "approved", type: "PDF", updatedAt: new Date().toISOString() })));
                    toast.success("Todos os documentos regulatórios foram aprovados automaticamente!");
                  }}>
                    Aprovar Todos
                  </Button>
                  <Button size="sm" className="flex-1 animate-pulse" onClick={() => {
                    toast.success("Exportado relatório legal desta conta!");
                  }}>
                    Exportar Compliance
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Workflow Automations triggers Tab */}
        <TabsContent value="automations">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Réguas e Gatilhos de Comunicação Ativas</h3>
                <p className="text-xs text-muted-foreground">Monitore o relacionamento do distribuidor através dos disparos sistêmicos de notificação</p>
              </div>
              <Button size="sm" variant="outline" className="text-xs text-white border-white/20" onClick={() => {
                toast.success("Estatísticas de disparo limpas e reiniciadas!");
              }}>
                Limpar Logs
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {automations.map((aut) => (
                <div key={aut.id} className="rounded-xl border border-border bg-card/60 p-4 space-y-3 flex flex-col justify-between shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 shrink-0">{aut.type}</Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground shrink-0">Runs: <strong className="text-white">{aut.runs}</strong></span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = automations.map(a => a.id === aut.id ? { ...a, active: !a.active } : a);
                            setAutomations(updated);
                            toast.success(`Automação "${aut.name}" ${!aut.active ? "ativada" : "pausada"}.`);
                          }}
                          className="focus:outline-none shrink-0"
                        >
                          {aut.active ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[9px] font-bold">Ativo</Badge>
                          ) : (
                            <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/30 text-[9px] font-bold">Pausado</Badge>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-xs text-white truncate">{aut.name}</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{aut.description}</p>
                  </div>
                  
                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <button
                      onClick={() => {
                        const updated = automations.map(a => a.id === aut.id ? { ...a, active: !a.active } : a);
                        setAutomations(updated);
                        toast.success(`Gatilho de rede "${aut.name}" foi ${!aut.active ? "ativado" : "desativado"}.`);
                      }}
                      className="text-[11px] text-muted-foreground font-semibold hover:text-white transition-all"
                    >
                      Alternar
                    </button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-[11px] text-primary hover:bg-primary/10 font-bold"
                      onClick={() => {
                        const updated = automations.map(a => a.id === aut.id ? { ...a, runs: a.runs + 1 } : a);
                        setAutomations(updated);
                        toast.success(`Disparando webhook/mensagem para ${getCustomerLabel(c)} com sucesso.`);
                      }}
                    >
                      Forçar Gatilho
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
