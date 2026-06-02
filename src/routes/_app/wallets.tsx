import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/widgets/page-header";
import { KpiCard } from "@/components/widgets/kpi-card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Wallet, Lock, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletDashboard } from "@/components/payments/wallet-dashboard";
import { PaymentHistory } from "@/components/payments/payment-history";
import { SupabaseService } from "@/modules/auth/services/supabase.service";
import { supabase } from "@/lib/supabase-client";

export const Route = createFileRoute("/_app/wallets")({ component: WalletsPage });

function WalletsPage() {
  const [saques, setSaques] = useState<any[]>([]);
  const [summary, setSummary] = useState({ total: 0, pending: 0, approved: 0, anomalies: 0 });
  const [wallets, setWallets] = useState({ bonus: { balance: 0, available: 0 }, main: { balance: 0, available: 0 }, points: { balance: 0, available: 0 } });

  useEffect(() => {
    (async () => {
      const [{ data: withdrawalsData }, { data: bonusWalletData }, { data: mainWalletData }, { data: pointsWalletData }] = await Promise.all([
        supabase.from("withdrawals").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("bonus_wallets").select("*").limit(1).maybeSingle(),
        supabase.from("wallets").select("*").limit(1).maybeSingle(),
        supabase.from("points_wallets").select("*").limit(1).maybeSingle(),
      ]);

      const transformedWithdrawals = (withdrawalsData || []).map(w => ({
        id: w.id,
        user: w.user_name,
        valor: Number(w.valor || 0),
        metodo: w.metodo,
        status: w.status,
        risco: w.risco,
        wallet_type: w.wallet_type,
      }));
      
      setSaques(transformedWithdrawals);
      setSummary({
        total: transformedWithdrawals.reduce((sum, w) => sum + Number(w.valor || 0), 0),
        pending: transformedWithdrawals.filter(w => w.status === "pendente").length,
        approved: transformedWithdrawals.filter(w => w.status === "aprovado").length,
        anomalies: transformedWithdrawals.filter(w => w.risco).length,
      });

      setWallets({
        bonus: { 
          balance: Number(bonusWalletData?.balance || 0), 
          available: Number(bonusWalletData?.available_balance || 0) 
        },
        main: { 
          balance: Number(mainWalletData?.balance || 0), 
          available: Number(mainWalletData?.available_balance || 0) 
        },
        points: { 
          balance: Number(pointsWalletData?.balance || 0), 
          available: Number(pointsWalletData?.available_balance || 0) 
        },
      });
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Financeiro" title="Carteiras & Saques" subtitle="Operações financeiras com dados reais do Supabase." actions={<Button size="sm">Aprovar em massa</Button>} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Saldo Bônus Total" value={`R$ ${wallets.bonus.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} accent="primary" icon={Wallet} />
        <KpiCard label="Bônus Disponível (50%)" value={`R$ ${wallets.bonus.available.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} accent="success" icon={Lock} />
        <KpiCard label="Bônus Bloqueado" value={`R$ ${(wallets.bonus.balance - wallets.bonus.available).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} accent="warning" icon={TrendingUp} />
      </div>

      <Tabs defaultValue="saques" className="space-y-4">
        <TabsList>
          <TabsTrigger value="saques">Saques</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="historico">Histórico de Pagamentos</TabsTrigger>
        </TabsList>
        <TabsContent value="saques" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Saldo total carteiras" value={`R$ ${(wallets.bonus.balance + wallets.main.balance).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} accent="primary" />
            <KpiCard label="Saques pendentes" value={String(summary.pending)} accent="warning" />
            <KpiCard label="Saques aprovados" value={String(summary.approved)} />
            <KpiCard label="Anomalias detectadas" value={String(summary.anomalies)} accent="destructive" />
          </div>

          <div className="rounded-xl border border-warning/30 bg-warning/5 p-3 flex items-center gap-3">
            <ShieldAlert className="h-4 w-4 text-warning" />
            <p className="text-sm flex-1"><span className="font-medium">{summary.anomalies} saques</span> marcados com risco.</p>
          </div>

          <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-2.5 text-left">Distribuidor</th><th className="px-4 py-2.5 text-right">Valor</th><th className="px-4 py-2.5 text-left">Tipo</th><th className="px-4 py-2.5 text-left">Método</th><th className="px-4 py-2.5 text-left">Status</th><th className="px-4 py-2.5 text-left">IA</th></tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {saques.map((s) => (
                  <tr key={s.id} className="hover:bg-accent/30">
                    <td className="px-4 py-3">{s.user}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">R$ {s.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{s.wallet_type || "main"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.metodo}</td>
                    <td className="px-4 py-3 capitalize">{s.status}</td>
                    <td className="px-4 py-3">{s.risco && <span className="text-xs text-destructive">⚠ anomalia</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="dashboard"><WalletDashboard /></TabsContent>
        <TabsContent value="historico"><PaymentHistory /></TabsContent>
      </Tabs>
    </div>
  );
}
