import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getCustomerLabel } from "@/lib/customer-label";
import { useCustomer360ByCustomerId } from "@/hooks/customers/useCustomer360New";
import { useProfile360ByIdComprador } from "@/hooks/profiles/useProfile360";
import { useCRM360 } from "@/hooks/crm/useCRM360";
import { useMLM360 } from "@/hooks/mlm/useMLM360";
import { useFinance360 } from "@/hooks/finance/useFinance360";
import { CustomerProfileCard } from "@/components/customers/CustomerProfileCard";
import { CustomerKPIs } from "@/components/customers/CustomerKPIs";
import { CustomerTimelineTab } from "@/components/customers/CustomerTimelineTab";
import { CustomerOrdersTab } from "@/components/customers/CustomerOrdersTab";
import { CustomerWalletTab } from "@/components/customers/CustomerWalletTab";
import { CustomerNetworkTab } from "@/components/customers/CustomerNetworkTab";
import { CustomerDocumentsTab } from "@/components/customers/CustomerDocumentsTab";
import { CustomerAutomationsTab } from "@/components/customers/CustomerAutomationsTab";
import { useCreateWallet } from "@/hooks/mutations/wallets/useCreateWallet";
import { useCreatePointsWallet } from "@/hooks/mutations/wallets/useCreatePointsWallet";
import { useUpdateWalletBalance } from "@/hooks/mutations/wallets/useUpdateWalletBalance";
import { useCreateWalletTransaction } from "@/hooks/mutations/wallets/useCreateWalletTransaction";

export const Route = createFileRoute("/_app/customers/$id")({
  component: Customer360,
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#06080d]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
    </div>
  ),
});

function Customer360() {
  // NOTE: Route parameter 'id' represents id_comprador (text), not customers.id (UUID)
  // This is the canonical identifier used throughout the application
  const { id } = Route.useParams();

  // Mutations para wallet
  const createWallet = useCreateWallet();
  const createPointsWallet = useCreatePointsWallet();
  const updateWalletBalance = useUpdateWalletBalance();
  const createWalletTransaction = useCreateWalletTransaction();

  // MIGRAÇÃO EM PROGRESSO: Usando novos services específicos por domínio
  // Mantém compatibilidade com Customer360Service para dados não migrados
  
  // Busca dados de perfil usando Profile360Service
  const { data: profile360, isLoading: isLoadingProfile, isError: isErrorProfile, error: errorProfile } = useProfile360ByIdComprador(id);
  
  // Busca dados CRM usando CRM360Service
  const { data: crm360 } = useCRM360(undefined, id);
  
  // Busca dados MLM usando MLM360Service
  const { data: mlm360 } = useMLM360(undefined, id);
  
  // Busca dados financeiros usando Finance360Service
  const { data: finance360 } = useFinance360(undefined, id);

  // Fallback para Customer360Service para dados não migrados (sponsor, orderItems, products)
  const { data: customer360, refetch } = useCustomer360ByCustomerId(id, {
    includeOrders: true,
    includeOrderItems: true,
    includeProducts: true,
    includeSponsor: true,
  });

  const isLoading = isLoadingProfile;
  const isError = isErrorProfile;
  const error = errorProfile;

  // Combinar dados dos diferentes services
  const customer = profile360?.profile;
  const orders = crm360?.orders || [];
  const orderItems = customer360?.orderItems || [];
  const products = customer360?.products || [];
  const sponsor = customer360?.sponsor;
  const wallet = finance360?.wallet;
  const pointsWallet = finance360?.pointsWallet;
  const walletTransactions = finance360?.walletTransactions || [];
  const downlines = mlm360?.downlines || [];
  const networkRelationships = mlm360?.networkRelationships || [];
  const metrics = profile360?.metrics;
  const networkMetrics = profile360?.networkMetrics;
  const score = profile360?.score;

  // Handlers para wallet
  const handleCreateWallet = () => {
    if (!customer) return;
    createWallet.mutate(customer.id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleCreatePointsWallet = () => {
    if (!customer) return;
    createPointsWallet.mutate(customer.id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

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
        <Link to="/customers" className="hover:text-foreground transition-colors">
          Distribuidores
        </Link>
        <span>/</span>
        <span className="text-foreground">{getCustomerLabel(customer)}</span>
      </div>

      <PageHeader
        eyebrow="Customer 360"
        title={getCustomerLabel(customer)}
        subtitle={`${customer.plano_comprador || "Plano Integral"} · ${customer.qualification || "Bronze"} · Ativo desde ${
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
        <CustomerProfileCard customer={customer} sponsor={sponsor} />
        <CustomerKPIs customer={customer} orders={orders} metrics={metrics} networkMetrics={networkMetrics} score={score} />
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
            updateWalletBalance={updateWalletBalance}
            createWalletTransaction={createWalletTransaction}
            refetch={refetch}
          />
        </TabsContent>

        <TabsContent value="network">
          <CustomerNetworkTab customer={customer} downlines={downlines} networkMetrics={networkMetrics} />
        </TabsContent>

        <TabsContent value="docs">
          <CustomerDocumentsTab customer={customer} />
        </TabsContent>

        <TabsContent value="automations">
          <CustomerAutomationsTab customer={customer} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
