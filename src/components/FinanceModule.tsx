import React, { useState } from 'react';
import { 
  Wallet, 
  DollarSign, 
  Briefcase, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Clock, 
  Download, 
  CheckCircle,
  AlertTriangle,
  Send,
  Building,
  CreditCard,
  FileSpreadsheet
} from 'lucide-react';
import { INITIAL_TRANSACTIONS } from '../data';
import { Transaction } from '../types';

export const FinanceModule: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [balance, setBalance] = useState(12850.40);
  const [totalWithdrawn, setTotalWithdrawn] = useState(18500.00);
  
  // Withdraw form states
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'HyperWallet' | 'ACH' | 'USDC'>('HyperWallet');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > balance) return;

    // Execute state changes
    setBalance(prev => prev - amount);
    setTotalWithdrawn(prev => prev + amount);

    const pseudoTxnId = `TXN-${Math.floor(Math.random() * 9000) + 1000}`;
    const newTxn: Transaction = {
      id: pseudoTxnId,
      date: new Date().toISOString(),
      type: 'Withdrawal',
      amount: -amount,
      status: 'Completed',
      description: `Instant payout settlement via custom provider route (${withdrawMethod})`,
      recipient: 'Olivia Miller'
    };

    setTransactions([newTxn, ...transactions]);
    setWithdrawSuccess(true);
    setWithdrawAmount('');
    
    // Clear success message after delay
    setTimeout(() => setWithdrawSuccess(false), 5000);
  };

  const getTxStyle = (type: string) => {
    switch (type) {
      case 'Commission': return { color: 'text-emerald-450 bg-emerald-500/10 border-emerald-500/20', icon: ArrowUpCircle };
      case 'Bonus': return { color: 'text-indigo-455 bg-indigo-500/10 border-indigo-505/20', icon: ArrowUpCircle };
      case 'Retail Sale': return { color: 'text-sky-455 bg-sky-500/10 border-sky-505/20', icon: ArrowUpCircle };
      case 'Withdrawal': return { color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: ArrowDownCircle };
      default: return { color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', icon: Clock };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      
      {/* Title section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-5 bg-slate-900/30 rounded-xl border border-slate-800/80 gap-4 text-left">
        <div>
          <h2 className="font-display font-bold text-2xl tracking-tight text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-rose-450" /> Finance Ledger & Commission Payouts
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Reconcile uncompressed downline commission overrides, audit financial transaction history, and dispatch merchant payouts securely.
          </p>
        </div>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Available Balance */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between text-left hover:border-slate-700 transition:-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl" />
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest leading-none">Wallet Balance</p>
            <h3 className="text-2xl font-bold font-display mt-2.5 text-white">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="mt-4 flex items-center text-xs font-mono text-emerald-400">
            <CheckCircle className="w-4 h-4 mr-1.5 shrink-0" />
            <span>ACCUMULATED OVERRIDE FUNDS</span>
          </div>
        </div>

        {/* Card 2: Total Pay-out withdrawn */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between text-left hover:border-slate-700 transition:-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-500/5 rounded-full blur-xl" />
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest leading-none">Settled Outbound</p>
            <h3 className="text-2xl font-bold font-display mt-2.5 text-white">
              ${totalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="mt-4 flex items-center text-xs font-mono text-slate-400">
            <Briefcase className="w-4 h-4 mr-1.5 shrink-0 text-slate-500" />
            <span>DISPATCHED VIA MAIN GATEWAY</span>
          </div>
        </div>

        {/* Card 3: Pending Pools */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between text-left hover:border-slate-700 transition:-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl" />
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest leading-none">Pending Calculations</p>
            <h3 className="text-2xl font-bold font-display mt-2.5 text-slate-350">
              $1,232.50
            </h3>
          </div>
          <div className="mt-4 flex items-center text-xs font-mono text-amber-400">
            <Clock className="w-4 h-4 mr-1.5 shrink-0 animate-spin" />
            <span>COMPRESSION RUN IN PROCESS</span>
          </div>
        </div>

      </div>

      {/* Splits layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Transaction list table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-800 bg-slate-950/20 text-left">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Corporate Commissions Ledger</h3>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">Real-time ledger updates matched from global checkout APIs</p>
              </div>
              <button className="flex items-center space-x-1 border border-slate-800 hover:border-slate-700 bg-slate-950 px-2.5 py-1.5 rounded text-[10px] font-mono text-slate-400 hover:text-white transition-all cursor-pointer">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>EXCEL LEDGER</span>
              </button>
            </div>

            <div className="overflow-x-auto text-left">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 font-mono text-[9.5px] uppercase">
                    <th className="p-3.5">Transaction ID</th>
                    <th className="p-3.5">Details</th>
                    <th className="p-3.5">Class</th>
                    <th className="p-3.5">Cash Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {transactions.map((t) => {
                    const styling = getTxStyle(t.type);
                    const Icon = styling.icon;
                    const isCredit = t.amount > 0;
                    return (
                      <tr key={t.id} className="hover:bg-slate-850/20 transition-colors">
                        <td className="p-3.5 font-mono">
                          <span className="text-slate-300">{t.id}</span>
                          <span className="block text-[8.5px] text-slate-500 mt-0.5">Date: {t.date.substring(0, 10)}</span>
                        </td>
                        <td className="p-3.5">
                          <p className="font-semibold text-slate-200 uppercase text-[11px] tracking-wide leading-tight">{t.recipient}</p>
                          <p className="text-[10.5px] text-slate-500 truncate max-w-[220px] mt-0.5" title={t.description}>{t.description}</p>
                        </td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wide border ${styling.color}`}>
                            <Icon className="w-3 h-3" />
                            <span>{t.type}</span>
                          </span>
                        </td>
                        <td className={`p-3.5 font-mono font-medium text-right text-sm ${isCredit ? 'text-emerald-450' : 'text-rose-450'}`}>
                          {isCredit ? '+' : ''}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* Right: Instant Bank cashout Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Dispatch Instant Settlement</h3>
              <p className="text-[10px] font-mono text-slate-505 mt-0.5">Cashout accumulated commission assets directly</p>
            </div>
            <Send className="w-4 h-4 text-rose-450" />
          </div>

          {withdrawSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 mb-4 animate-fade-in flex items-start space-x-2.5">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Withdrawal request processed successfully. Capital routing complete.</span>
            </div>
          )}

          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">CASH AMOUNT TO DRAW (USD)</label>
              <div className="relative">
                <div className="absolute left-3 top-2 text-slate-500 text-xs font-mono">$</div>
                <input 
                  type="number"
                  step="0.01"
                  min="10"
                  max={balance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none p-2 pl-7 rounded text-xs font-mono text-slate-200"
                  placeholder={`Max: ${balance.toFixed(2)}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">DISBURSEMENT METHOD</label>
              <div className="grid grid-cols-1 gap-2.5 font-sans">
                
                {/* Method 1 */}
                <label className={`p-2.5 rounded border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                  withdrawMethod === 'HyperWallet' ? 'bg-slate-950 border-rose-500 text-white' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}>
                  <input 
                    type="radio" 
                    name="method" 
                    checked={withdrawMethod === 'HyperWallet'}
                    onChange={() => setWithdrawMethod('HyperWallet')}
                    className="hidden" 
                  />
                  <div className="flex items-center space-x-2.5">
                    <Building className="w-3.5 h-3.5 text-indigo-400" />
                    <div>
                      <span className="block font-semibold">HyperWallet Visa Sync</span>
                      <span className="block text-[9px] text-slate-500 font-mono">Instant Payout | Zero Transfer Fee</span>
                    </div>
                  </div>
                </label>

                {/* Method 2 */}
                <label className={`p-2.5 rounded border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                  withdrawMethod === 'ACH' ? 'bg-slate-950 border-rose-500 text-white' : 'bg-slate-950/40 border-slate-800 hover:border-slate-705 text-slate-400'
                }`}>
                  <input 
                    type="radio" 
                    name="method" 
                    checked={withdrawMethod === 'ACH'}
                    onChange={() => setWithdrawMethod('ACH')}
                    className="hidden" 
                  />
                  <div className="flex items-center space-x-2.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <span className="block font-semibold">US Wire bank transfer</span>
                      <span className="block text-[9px] text-slate-500 font-mono">1-2 Business Days | Minor Ledger Fee</span>
                    </div>
                  </div>
                </label>

                {/* Method 3 */}
                <label className={`p-2.5 rounded border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                  withdrawMethod === 'USDC' ? 'bg-slate-950 border-rose-500 text-white' : 'bg-slate-950/40 border-slate-800 hover:border-slate-705 text-slate-400'
                }`}>
                  <input 
                    type="radio" 
                    name="method" 
                    checked={withdrawMethod === 'USDC'}
                    onChange={() => setWithdrawMethod('USDC')}
                    className="hidden" 
                  />
                  <div className="flex items-center space-x-2.5">
                    <Wallet className="w-3.5 h-3.5 text-sky-400" />
                    <div>
                      <span className="block font-semibold">Instantly credit USDC Wallet</span>
                      <span className="block text-[9px] text-slate-500 font-mono">Blockchain Settlement | Direct API Outbound</span>
                    </div>
                  </div>
                </label>

              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-450 hover:text-white rounded font-mono text-xs font-semibold cursor-pointer transition-all uppercase tracking-wider"
            >
              EXECUTE BLOCKCHAIN DISPATCH
            </button>

          </form>
        </div>

      </div>

    </div>
  );
};
