import { Wallet, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/customer-calculations";
import { useWalletTransactions } from "@/hooks/customers/useWalletTransactions";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

interface CustomerWalletTabProps {
  wallet: any;
  pointsWallet: any;
  walletTransactions: any[];
  handleCreateWallet: () => void;
  handleCreatePointsWallet: () => void;
  updateWalletBalance: any;
  createWalletTransaction: any;
  refetch: () => void;
}

export function CustomerWalletTab({
  wallet,
  pointsWallet,
  walletTransactions,
  handleCreateWallet,
  handleCreatePointsWallet,
  updateWalletBalance,
  createWalletTransaction,
  refetch,
}: CustomerWalletTabProps) {
  const {
    showAddTx,
    setShowAddTx,
    txType,
    setTxType,
    txAmount,
    setTxAmount,
    txDesc,
    setTxDesc,
    handleAddTransaction,
  } = useWalletTransactions({
    wallet,
    updateWalletBalance,
    createWalletTransaction,
    refetch,
  });

  return (
    <div className="space-y-6">
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
              <Button type="button" size="sm" variant="outline" onClick={() => setShowAddTx(false)}>
                Cancelar
              </Button>
              <Button type="submit" size="sm">
                Confirmar Transação
              </Button>
            </div>
          </form>
        </div>
      )}

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
    </div>
  );
}
