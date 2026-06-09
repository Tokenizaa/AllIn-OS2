import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getCustomerLabel } from "@/lib/customer-label";
import { useCustomer360Data } from "@/hooks/customers/useCustomer360Data";
import { CustomerProfileCard } from "@/components/customers/CustomerProfileCard";
import { CustomerKPIs } from "@/components/customers/CustomerKPIs";
import { CustomerTimelineTab } from "@/components/customers/CustomerTimelineTab";
import { CustomerOrdersTab } from "@/components/customers/CustomerOrdersTab";
import { CustomerWalletTab } from "@/components/customers/CustomerWalletTab";
import { CustomerNetworkTab } from "@/components/customers/CustomerNetworkTab";
import { CustomerDocumentsTab } from "@/components/customers/CustomerDocumentsTab";
import { CustomerAutomationsTab } from "@/components/customers/CustomerAutomationsTab";
import { CustomerService } from "@/services/customers";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/customers/$id")({
  component: Customer360,
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#06080d]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
    </div>
  ),
});

function Customer360() {
  const { id } = Route.useParams();

  // First, fetch the customer by UUID to get the id_comprador
  const { data: customerBasic, isLoading: isLoadingBasic, isError: isErrorBasic } = useQuery({
    queryKey: ["customer-basic", id],
    queryFn: () => CustomerService.fetchCustomerById(id),
  });

  const idComprador = customerBasic?.id_comprador;
  const sponsorId = customerBasic?.patrocinador_comprador;

  const {
    customer,
    orders,
    sponsor,
    wallet,
    pointsWallet,
    walletTransactions,
    downlines,
    isLoading,
    isError,
    error,
    refetch,
    handleCreateWallet,
    handleCreatePointsWallet,
    updateWalletBalance,
    createWalletTransaction,
  } = useCustomer360Data(idComprador, sponsorId);

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
        <CustomerProfileCard customer={customer} sponsor={sponsor} />
        <CustomerKPIs customer={customer} orders={orders} />
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
          <CustomerOrdersTab orders={orders} />
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
          <CustomerNetworkTab customer={customer} downlines={downlines} />
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
