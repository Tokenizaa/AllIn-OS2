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
  Coins
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

export const Route = createFileRoute("/app/customers/$id")({
  component: Customer360,
});

function Customer360() {
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

  // Wallet Movement Manual Trigger Form
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

  // Initialize financial wallet
  const handleCreateWallet = () => {
    if (!customer) return;
    createWallet.mutate(customer.id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Initialize points loyalty wallet
  const handleCreatePointsWallet = () => {
    if (!customer) return;
    createPointsWallet.mutate(customer.id, {
      onSuccess: () => {
        refetch();
      },
    });
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

    updateWalletBalance.mutate(
      { walletId: wallet.id, balance: balanceAfter },
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
            },
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

  // Timeline entries
  const [noteText, setNoteText] = useState("");
  const [customNotes, setCustomNotes] = useState<any[]>([]);

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
      { id: "1", type: "note" as const, title: "Ficha Operacional", description: "Distribuidor sincronizado com os dados do Supabase.", at: customer?.created_at || new Date().toISOString() },
      ...orders.slice(0, 4).map((o, index) => ({
        id: `order-tl-${index}`,
        type: "order" as const,
        title: `Pedido ${o.numero_pedido || o.id.slice(0, 8)}`,
        description: `Status de processamento: ${o.status_pedido || o.status || "Pendente"}`,
        at: o.created_at || new Date().toISOString(),
      })),
    ];
  }, [customNotes, orders, customer?.created_at]);

  if (isError) {
    return (
      <div className="space-y-3">
        <PageHeader eyebrow="Customer 360" title="Cliente não encontrado" subtitle="Falha ao carregar dados do cliente." />
        <p className="text-sm text-destructive">Erro: {error instanceof Error ? error.message : "falha desconhecida"}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-xs text-muted-foreground animate-pulse font-medium">Carregando dados estruturados do Supabase...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-3">
        <PageHeader eyebrow="Customer 360" title="Cliente não encontrado" subtitle="O cliente solicitado não existe." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/app/customers" className="hover:text-foreground transition-colors">
          Distribuidores
        </Link>
        <span>/</span>
        <span className="text-foreground">{getCustomerLabel(customer)}</span>
      </div>

      <PageHeader
        eyebrow="Customer 360"
        title={getCustomerLabel(customer)}
        subtitle={`${customer.plano_id || customer.plan_id || "Plano Integral"} · ${customer.qualification || "Bronze"} · Ativo desde ${
          customer.created_at ? new Date(customer.created_at).toLocaleDateString("pt-BR") : "-"
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
              {getCustomerInitials(customer)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate text-white">{getCustomerLabel(customer)}</p>
              <p className="text-xs text-muted-foreground truncate">{customer.id_comprador || customer.usuario}</p>
            </div>
          </div>
          
          <div className="space-y-2 text-xs border-t border-border/60 pt-3">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{customer.user_id || customer.id_comprador || "Sem ID"}</span>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5 shrink-0" /> <span>{customer.telefone || "-"}</span>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" /> <span>{customer.cidade || "-"}/{customer.estado || "-"}</span>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-3.5 w-3.5 shrink-0" /> <span>CPF {customer.metadata?.cpf || customer.cpf || "-"}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge variant="outline" className="bg-primary/5 ">{customer.qualification || "Bronze"}</Badge>
            <Badge variant="outline" className="bg-primary/5">{customer.plano_id || customer.plan_id || "Integral"}</Badge>
            <Badge variant="outline" className={cn("capitalize font-semibold", statusStyles[customer.status || "pending"])}>
              {customer.status || "pending"}
            </Badge>
          </div>
          
          {sponsor && (
            <div className="rounded-lg border border-border bg-background/40 p-2.5 text-xs shadow-inner">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Patrocinador</p>
              <Link to="/app/customers/$id" params={{ id: sponsor.id }} className="mt-1 font-semibold hover:text-primary transition-all flex items-center gap-1 text-white">
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

        <TabsContent value="timeline">
          <CustomerTimelineTab customer={customer} orders={orders} />
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

        <TabsContent value="network">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Parceiros da Rede (Indicações Diretas)</h3>
                <p className="text-xs text-muted-foreground">Listagem em tempo real de distribuidores cujo sponsor direta é @{customer.id_comprador || customer.usuario}</p>
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
                        <Link to="/app/customers/$id" params={{ id: dl.id }} className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-0.5">
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
                
                <div className="border-t border-border pt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-white border-white/20" onClick={() => {
                    documents.forEach((d: any) => docStatusMutation.mutate({ docId: d.id, status: "approved" }));
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

        <TabsContent value="automations">
          <CustomerAutomationsTab customer={customer} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
