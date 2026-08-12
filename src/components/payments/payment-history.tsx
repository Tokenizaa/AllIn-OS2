import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Search, Download, Eye, RefreshCw, Loader2 } from 'lucide-react';
import { useAuth } from '@/modules/auth';
import { toast } from 'sonner';
import { usePayments } from '@/hooks/payments/usePayments';
import { usePaymentHistoryFilters } from "@/hooks/payments/usePaymentHistoryFilters";
import { useDistributorProfileQuery } from "@/hooks/distributor/useDistributorProfileQuery";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded' | 'cancelled' | 'processing' | 'failed';
  paymentMethod: 'card' | 'pix' | 'boleto' | 'cash';
  createdAt: string;
  orderId?: string;
  customerName: string;
}

export function PaymentHistory() {
  const { user } = useAuth();
  const { data: distributorProfile } = useDistributorProfileQuery();
  const idComprador = distributorProfile?.id || user?.id;

  const { data: paymentsData, isLoading, refetch } = usePayments(50);

  const payments = paymentsData || [];

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
    getStatusColor,
    getPaymentMethodIcon,
    filteredPayments,
    handleViewDetails,
    handleExport,
    handleRefresh,
  } = usePaymentHistoryFilters({ payments, refetch });

  if (!idComprador) {
    return (
      <div className="p-6 text-center text-muted-foreground text-sm">
        Entre em uma conta ativa de distribuidor para acessar o histórico de transações.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Histórico de Transações</h2>
          <p className="text-muted-foreground">Consulte e filtre todas as transações reais de pedidos e faturas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Atualizar
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={payments.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrar Transações</CardTitle>
          <CardDescription>Busque por faturas ou filtre por método e status de liquidação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Busque por faturamento, ID ou número do pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Statuses</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
                <SelectItem value="refunded">Reembolsado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={methodFilter => setMethodFilter(methodFilter)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Métodos</SelectItem>
                <SelectItem value="card">Cartão de Crédito</SelectItem>
                <SelectItem value="pix">PIX Instantâneo</SelectItem>
                <SelectItem value="boleto">Boleto Bancário</SelectItem>
                <SelectItem value="cash">Pagar na Entrega</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transações de Liquidação</CardTitle>
          <CardDescription>
            Exibindo {isLoading ? '...' : filteredPayments.length} de {isLoading ? '...' : payments.length} pagamentos realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Buscando transações consolidadas...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fatura (ID)</TableHead>
                  <TableHead>Sacador/Cliente</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Pedido associado</TableHead>
                  <TableHead className="text-right">Recibo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs">{payment.id}</TableCell>
                    <TableCell>{payment.customerName}</TableCell>
                    <TableCell className="font-semibold tabular-nums">
                      R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <span className="text-base" title={payment.paymentMethod}>
                        {getPaymentMethodIcon(payment.paymentMethod)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(payment.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="font-mono text-xs">{payment.orderId || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(payment.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhuma transação financeira atende aos critérios de busca selecionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
