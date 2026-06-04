import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Wallet, Gift, Star, ArrowUpRight, ArrowDownLeft, History, CreditCard, RotateCw } from 'lucide-react';
import { useAuth } from '@/modules/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWalletBalance, getWalletTransactions, ensureWallet, creditWallet, debitWallet } from '../../lib/api/wallet.functions';
import { getBonusWalletBalance, getBonusTransactions, ensureBonusWallet } from '../../lib/api/bonus-wallet.functions';
import { getPointsWalletBalance, getPointsTransactions, ensurePointsWallet } from '../../lib/api/points-wallet.functions';
import { toast } from 'sonner';

interface WalletData {
  balance: number;
  availableBalance: number;
  frozenBalance: number;
  currency: string;
  bonusBalance: number;
  points: number;
  recentTransactions: Array<{
    id: string;
    type: 'credit' | 'debit' | 'freeze' | 'unfreeze';
    amount: number;
    description: string;
    date: string;
  }>;
  bonusTransactions: Array<{
    id: string;
    amount: number;
    source_type: string;
    description: string;
    created_at: string;
  }>;
  pointsTransactions: Array<{
    id: string;
    amount: number;
    source_type: string;
    description: string;
    created_at: string;
  }>;
}

export function WalletDashboard() {
  const { user, distributorProfile } = useAuth();
  const queryClient = useQueryClient();
  const customerId = distributorProfile?.id || user?.id;

  const { data: walletData, isLoading, refetch } = useQuery<WalletData | null>({
    queryKey: ['wallet-data', customerId],
    queryFn: async () => {
      if (!customerId) return null;

      // Ensure wallets exist first in the database
      try {
        await Promise.all([
          ensureWallet({ customerId }),
          ensureBonusWallet({ customerId }),
          ensurePointsWallet({ customerId })
        ]);
      } catch (err) {
        console.warn('Silent warning on ensure wallets:', err);
      }

      const [walletRes, bonusRes, pointsRes] = await Promise.all([
        getWalletBalance({ customerId }),
        getBonusWalletBalance({ customerId }),
        getPointsWalletBalance({ customerId })
      ]);

      const [txsRes, bonusTxsRes, pointsTxsRes] = await Promise.all([
        getWalletTransactions({ customerId, limit: 10 }),
        getBonusTransactions({ customerId, limit: 10 }),
        getPointsTransactions({ customerId, limit: 10 })
      ]);

      const balanceInfo = walletRes.success ? walletRes.data : { balance: 0, availableBalance: 0, frozenBalance: 0 };
      const bonusInfo = bonusRes.success ? bonusRes.data : { balance: 0, availableBalance: 0 };
      const pointsInfo = pointsRes.success ? pointsRes.data : { balance: 0, availableBalance: 0 };

      // Transform main transactions
      const recentTxs = txsRes.success && txsRes.data?.data
        ? txsRes.data.data.map((tx: any) => ({
            id: tx.id,
            type: tx.transaction_type === 'credit' ? 'credit' : 'debit',
            amount: Number(tx.amount || 0),
            description: tx.description || 'Wallet transaction',
            date: new Date(tx.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
          }))
        : [];

      // Transform bonus transactions
      const bonusTxs = bonusTxsRes.success && bonusTxsRes.data?.data
        ? bonusTxsRes.data.data.map((tx: any) => ({
            id: tx.id,
            amount: Number(tx.amount || 0),
            source_type: tx.source_type,
            description: tx.description || 'Bonus received',
            created_at: new Date(tx.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
          }))
        : [];

      // Transform points transactions
      const pointsTxs = pointsTxsRes.success && pointsTxsRes.data?.data
        ? pointsTxsRes.data.data.map((tx: any) => ({
            id: tx.id,
            amount: Number(tx.amount || 0),
            source_type: tx.source_type,
            description: tx.description || 'Points transaction',
            created_at: new Date(tx.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
          }))
        : [];

      return {
        balance: Number(balanceInfo.balance || 0),
        availableBalance: Number(balanceInfo.availableBalance || 0),
        frozenBalance: Number(balanceInfo.frozenBalance || 0),
        currency: 'BRL',
        bonusBalance: Number(bonusInfo.balance || 0),
        points: Number(pointsInfo.balance || 0),
        recentTransactions: recentTxs,
        bonusTransactions: bonusTxs,
        pointsTransactions: pointsTxs,
      };
    },
    enabled: !!customerId,
  });

  const creditMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!customerId) throw new Error('No customer ID');
      return creditWallet({
        customerId,
        amount,
        description: 'Adição de fundos via simulação',
        referenceType: 'manual',
      });
    },
    onSuccess: (res: any) => {
      if (res.success) {
        toast.success(`Mais R$ 100,00 adicionados com sucesso!`);
        queryClient.invalidateQueries({ queryKey: ['wallet-data', customerId] });
      } else {
        toast.error(`Erro ao adicionar fundos: ${res.error}`);
      }
    }
  });

  const debitMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!customerId) throw new Error('No customer ID');
      return debitWallet({
        customerId,
        amount,
        description: 'Saque de fundos via simulação',
        referenceType: 'withdrawal',
      });
    },
    onSuccess: (res: any) => {
      if (res.success) {
        toast.success(`Saque de R$ 100,00 simulado com sucesso!`);
        queryClient.invalidateQueries({ queryKey: ['wallet-data', customerId] });
      } else {
        toast.error(`Erro ao sacar: ${res.error}`);
      }
    }
  });

  const handleAddFunds = () => {
    creditMutation.mutate(100.00);
  };

  const handleWithdraw = () => {
    if (walletData && walletData.balance < 100) {
      toast.error('Saldo insuficiente para retirar R$ 100,00');
      return;
    }
    debitMutation.mutate(100.00);
  };

  const handleTransfer = () => {
    toast.info('Transferências interbancárias em manutenção pelo Gateway PagSeguro.');
  };

  if (!customerId) {
    return (
      <div className="p-6 text-center text-muted-foreground text-sm">
        Entre em uma conta ativa de distribuidor para acessar o painel financeiro de carteiras.
      </div>
    );
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
            <div className="text-2xl font-bold">
              {walletData.currency} {walletData.balance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Disponível para saques e compras: {walletData.currency} {walletData.availableBalance.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conta de Bônus</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {walletData.currency} {walletData.bonusBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Créditos promocionais utilizáveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos de Fidelidade</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {walletData.points.toLocaleString()} PTS
            </div>
            <p className="text-xs text-muted-foreground">
              Resgatáveis por descontos na loja
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleAddFunds} disabled={creditMutation.isPending}>
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Simular Depósito (+R$100)
        </Button>
        <Button variant="outline" onClick={handleWithdraw} disabled={debitMutation.isPending}>
          <ArrowDownLeft className="mr-2 h-4 w-4" />
          Simular Saque (-R$100)
        </Button>
        <Button variant="outline" onClick={handleTransfer}>
          <CreditCard className="mr-2 h-4 w-4" />
          Transferir
        </Button>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">
            <History className="mr-2 h-4 w-4" />
            Extrato Principal
          </TabsTrigger>
          <TabsTrigger value="bonus">
            <Gift className="mr-2 h-4 w-4" />
            Histórico de Bônus
          </TabsTrigger>
          <TabsTrigger value="points">
            <Star className="mr-2 h-4 w-4" />
            Histórico de Pontos
          </TabsTrigger>
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
                  {walletData.recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.type === 'credit'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {transaction.type === 'credit' ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div
                        className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}
                        {walletData.currency} {transaction.amount.toFixed(2)}
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
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950/20 dark:border-yellow-900/30">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Créditos de Bônus:</strong> Usados prioritariamente para pagar ativações mensais e novos planos. Expira após 90 dias sem novas vendas diretas.
                </p>
              </div>
              
              {walletData.bonusTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Nenhum histórico de bônus encontrado.</p>
              ) : (
                <div className="space-y-4">
                  {walletData.bonusTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{tx.description || `${tx.source_type} bonus`}</p>
                        <p className="text-sm text-muted-foreground">{tx.created_at}</p>
                      </div>
                      <div className="font-semibold text-yellow-600">
                        +{walletData.currency} {tx.amount.toFixed(2)}
                      </div>
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
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg dark:bg-purple-950/20 dark:border-purple-900/30">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  <strong>Pontos MLM:</strong> Acumule pontos em compras do seu grupo. Troque 100 pontos por R$ 5,00 em descontos instantâneos de checkout.
                </p>
              </div>

              {walletData.pointsTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Nenhum extrato de pontos registrado.</p>
              ) : (
                <div className="space-y-4">
                  {walletData.pointsTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{tx.description || `Pontação: ${tx.source_type}`}</p>
                        <p className="text-sm text-muted-foreground">{tx.created_at}</p>
                      </div>
                      <div className="font-semibold text-purple-600">
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} PTS
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
