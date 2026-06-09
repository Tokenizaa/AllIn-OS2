import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Wallet, Gift, Star, ArrowUpRight, ArrowDownLeft, History, CreditCard, RotateCw } from 'lucide-react';
import { useAuth } from '@/modules/auth';
import { toast } from 'sonner';
import { useWalletData } from '@/hooks/wallets/useWalletData';
import { useWalletActions } from '@/hooks/wallets/useWalletActions';

export function WalletDashboard() {
  const { user, distributorProfile } = useAuth();
  const customerId = distributorProfile?.id || user?.id;
  const { data: walletData, isLoading, refetch } = useWalletData(customerId);
  const { credit, debit } = useWalletActions(customerId, () => { void refetch(); });

  const handleAddFunds = () => {
    credit.mutate(100.0);
    toast.success('Mais R$ 100,00 adicionados com sucesso!');
  };

  const handleWithdraw = () => {
    if (walletData && walletData.balance < 100) {
      toast.error('Saldo insuficiente para retirar R$ 100,00');
      return;
    }
    debit.mutate(100.0);
    toast.success('Saque de R$ 100,00 simulado com sucesso!');
  };

  const handleTransfer = () => {
    toast.info('Transferências interbancárias em manutenção pelo Gateway PagSeguro.');
  };

  if (!customerId) {
    return <div className="p-6 text-center text-muted-foreground text-sm">Entre em uma conta ativa de distribuidor para acessar o painel financeiro de carteiras.</div>;
  }

  if (isLoading || !walletData) {
    return (
      <div className="p-6 flex flex-col items-center justify-center space-y-4">
        <RotateCw className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Sincronizando carteiras financeiras com Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Carteiras Financeiras</h2>
          <p className="text-muted-foreground">Gerencie seus saldos reais de distribuidor e consulte o histórico de transações reais.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => refetch()}><RotateCw className="h-4 w-4 mr-1" /> Atualizar</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Principal</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletData.currency} {walletData.balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Disponível para saques e compras: {walletData.currency} {walletData.availableBalance.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conta de Bônus</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletData.currency} {walletData.bonusBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Créditos promocionais utilizáveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos de Fidelidade</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletData.points.toLocaleString()} PTS</div>
            <p className="text-xs text-muted-foreground">Resgatáveis por descontos na loja</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleAddFunds} disabled={credit.isPending}><ArrowUpRight className="mr-2 h-4 w-4" /> Simular Depósito (+R$100)</Button>
        <Button variant="outline" onClick={handleWithdraw} disabled={debit.isPending}><ArrowDownLeft className="mr-2 h-4 w-4" /> Simular Saque (-R$100)</Button>
        <Button variant="outline" onClick={handleTransfer}><CreditCard className="mr-2 h-4 w-4" /> Transferir</Button>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions"><History className="mr-2 h-4 w-4" /> Extrato Principal</TabsTrigger>
          <TabsTrigger value="bonus"><Gift className="mr-2 h-4 w-4" /> Histórico de Bônus</TabsTrigger>
          <TabsTrigger value="points"><Star className="mr-2 h-4 w-4" /> Histórico de Pontos</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>Atividade detalhada da sua carteira principal do Supabase</CardDescription>
            </CardHeader>
            <CardContent>
              {walletData.recentTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Nenhuma transação encontrada nesta carteira.</p>
              ) : (
                <div className="space-y-4">
                  {walletData.recentTransactions.map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {transaction.type === 'credit' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date || transaction.created_at}</p>
                        </div>
                      </div>
                      <div className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}{walletData.currency} {Number(transaction.amount || 0).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bonus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Bônus</CardTitle>
              <CardDescription>Bônus MLM e indicações creditadas diretamente no banco</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {walletData.bonusTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Nenhum histórico de bônus encontrado.</p>
              ) : (
                <div className="space-y-4">
                  {walletData.bonusTransactions.map((tx: any) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{tx.description || `${tx.source_type} bonus`}</p>
                        <p className="text-sm text-muted-foreground">{tx.created_at}</p>
                      </div>
                      <div className="font-semibold text-yellow-600">+{walletData.currency} {Number(tx.amount || 0).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="points" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pontuação</CardTitle>
              <CardDescription>Resgate e acúmulo de pontos reais do programa de fidelidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {walletData.pointsTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Nenhum extrato de pontos registrado.</p>
              ) : (
                <div className="space-y-4">
                  {walletData.pointsTransactions.map((tx: any) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{tx.description || `Pontuação: ${tx.source_type}`}</p>
                        <p className="text-sm text-muted-foreground">{tx.created_at}</p>
                      </div>
                      <div className="font-semibold text-purple-600">
                        {Number(tx.amount || 0) > 0 ? '+' : ''}{Number(tx.amount || 0).toLocaleString()} PTS
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
