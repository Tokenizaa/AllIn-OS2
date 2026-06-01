import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  CircleDollarSign, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Sparkles, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { INITIAL_DISTRIBUTORS } from '../data';

// Mock chart data representing system-wide volumes
const VOLUME_TREND_DATA = [
  { month: 'Jan', Sales: 52000, GV: 85000, PV: 4200 },
  { month: 'Feb', Sales: 61000, GV: 92000, PV: 5100 },
  { month: 'Mar', Sales: 78000, GV: 112000, PV: 6200 },
  { month: 'Apr', Sales: 85000, GV: 125000, PV: 7300 },
  { month: 'May', Sales: 98000, GV: 138000, PV: 8800 },
  { month: 'Jun', Sales: 114000, GV: 145000, PV: 9400 }
];

const CATEGORY_SHARE_DATA = [
  { name: 'Suppl.', value: 45, color: '#10b981' },
  { name: 'SaaS', value: 30, color: '#6366f1' },
  { name: 'E-Comm', value: 15, color: '#38bdf8' },
  { name: 'Advert.', value: 10, color: '#f59e0b' }
];

export const ExecutiveDashboard: React.FC = () => {
  const [simulationMultiplier, setSimulationMultiplier] = useState<number>(1.0);
  const activeDistributors = INITIAL_DISTRIBUTORS.filter(d => d.status === 'Active');
  const totalVolumeGV = activeDistributors.reduce((acc, curr) => acc + curr.monthlyGV, 0) * simulationMultiplier;
  const totalCommissions = activeDistributors.reduce((acc, curr) => acc + curr.totalCommissions, 0) * simulationMultiplier;

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      
      {/* Title segment */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/30 p-5 rounded-xl border border-slate-800/80">
        <div>
          <h2 className="font-display font-bold text-2xl tracking-tight text-white">ALLIN Operating System</h2>
          <p className="text-slate-400 text-xs mt-1">
            Real-time analytics, MLM network volume overrides, and intelligent operations core.
          </p>
        </div>

        {/* Override Simulation slider tool */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col justify-center max-w-sm">
          <div className="flex justify-between items-center text-[11px] font-mono mb-1 text-slate-400">
            <span>NETWORK OVERRIDE SIMULATOR</span>
            <span className="text-emerald-400 font-bold">{simulationMultiplier.toFixed(1)}x</span>
          </div>
          <input 
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={simulationMultiplier}
            onChange={(e) => setSimulationMultiplier(parseFloat(e.target.value))}
            className="w-48 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: System-wide Group Volume */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between hover:border-slate-700/80 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Aggregate GV</p>
              <h3 className="text-2xl font-bold font-display mt-2 text-white">
                ${totalVolumeGV.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Layers className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-mono text-emerald-400">
            <TrendingUp className="w-4 h-4 mr-1shrink-0" />
            <span>+14.2% VS PREV CYCLE</span>
          </div>
        </div>

        {/* KPI 2: Total Commissions Paid */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between hover:border-slate-700/80 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Total Pay-out</p>
              <h3 className="text-2xl font-bold font-display mt-2 text-white">
                ${totalCommissions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CircleDollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-mono text-emerald-400">
            <ArrowUpRight className="w-4 h-4 mr-1 shrink-0" />
            <span>+8.9% NETWORK EARNINGS</span>
          </div>
        </div>

        {/* KPI 3: Global Network Strength */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between hover:border-slate-700/80 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl group-hover:bg-sky-500/10 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Active Members</p>
              <h3 className="text-2xl font-bold font-display mt-2 text-white">
                {Math.floor(INITIAL_DISTRIBUTORS.length * simulationMultiplier)} / {INITIAL_DISTRIBUTORS.length}
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-mono text-sky-300">
            <Activity className="w-4 h-4 mr-1 shrink-0" />
            <span>92% ACTIVE RETENTION RATE</span>
          </div>
        </div>

        {/* KPI 4: Global Core Sync Status */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between hover:border-slate-700/80 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">API Latency</p>
              <h3 className="text-2xl font-bold font-display mt-2 text-white">
                39ms
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-mono text-slate-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping mr-1.5" />
            <span>ALL PLUGINS DEPLOYED</span>
          </div>
        </div>

      </div>

      {/* Main Charts & Breakdown Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Volume Overrides Area Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-display font-medium text-slate-200">Global Volume Overrides Trend</h4>
              <p className="text-xs font-mono text-slate-500 tracking-tight">Active Group volume overrides compared over previous half year cycle</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> <span className="text-slate-400">GV</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> <span className="text-slate-400">Sales</span></span>
            </div>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VOLUME_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} fontStyle="italic" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    border: '1px solid #1e293b',
                    fontSize: '11px',
                    color: '#e2e8f0'
                  }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="GV" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorGv)" />
                <Area type="monotone" dataKey="Sales" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-display font-medium text-slate-200">Revenue Channel Breakdown</h4>
            <p className="text-xs font-mono text-slate-500 tracking-tight">Percentage shares of total checkout payments</p>
          </div>

          <div className="h-44 flex items-center justify-center relative mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_SHARE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_SHARE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    border: '1px solid #1e293b',
                    fontSize: '11px',
                    color: '#e2e8f0'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="block text-xl font-bold font-display text-white">45%</span>
              <span className="text-[9px] font-mono text-emerald-400 tracking-wider">SUPPLEMENTS</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-mono">
            {CATEGORY_SHARE_DATA.map((c) => (
              <div key={c.name} className="flex items-center space-x-2 bg-slate-950/40 p-1.5 rounded border border-slate-800/40">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-slate-400 font-sans">{c.name}</span>
                <span className="text-slate-200 font-bold ml-auto">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Segment: Operations Feed & Copilot Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Real-time System Actions Trigger list */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-display font-medium text-slate-200">Pending Executive Controls</h4>
            <p className="text-xs font-mono text-slate-500 tracking-tight">Manual actions required to resolve system compliance hold queue</p>
          </div>

          <div className="space-y-3 mt-4">
            
            {/* Action 1 */}
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex justify-between items-center">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                <div>
                  <h5 className="text-xs font-medium text-slate-200">Approve distributor Rank Advancement - Marcus Aurelius</h5>
                  <p className="text-[10px] font-mono text-slate-500">Milestone hit: Diamond ($62,000 GV)</p>
                </div>
              </div>
              <button className="text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded transition-all cursor-pointer">
                APPROVE
              </button>
            </div>

            {/* Action 2 */}
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex justify-between items-center">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                <div>
                  <h5 className="text-xs font-medium text-slate-200">Release hyperwallet bulk payouts total $22,400.00</h5>
                  <p className="text-[10px] font-mono text-slate-500">Uncompressed override loop checks matched successfully</p>
                </div>
              </div>
              <button className="text-[11px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 px-3 py-1.5 rounded transition-all cursor-pointer">
                EXECUTE PAYOUT
              </button>
            </div>

            {/* Action 3 */}
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex justify-between items-center">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-sky-400 mt-1 shrink-0" />
                <div>
                  <h5 className="text-xs font-medium text-slate-200">Evaluate Shopify direct product schema conflict on NMX-BIO-01</h5>
                  <p className="text-[10px] font-mono text-slate-500">Sync variance: Stock metadata mismatch warnings</p>
                </div>
              </div>
              <button className="text-[11px] font-mono bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 px-3 py-1.5 rounded transition-all cursor-pointer">
                RESOLVE
              </button>
            </div>

          </div>
        </div>

        {/* Gemini copilot dynamic suggestions summary card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 border border-purple-500/30 h-4 text-purple-400 animate-pulse bg-purple-500/10 p-0.5 rounded" />
                <h4 className="font-display font-medium text-slate-200">Gemini Pro AI OS Insights</h4>
              </div>
              <p className="text-xs font-mono text-slate-500 tracking-tight mt-0.5">Automated diagnostic intelligence on global commission override loop health</p>
            </div>
            <span className="text-[10px] bg-indigo-505/10 border border-indigo-500/20 text-indigo-400 font-mono py-0.5 px-2 rounded-full">RECOMMENDER ENABLED</span>
          </div>

          <div className="mt-4 space-y-3 font-sans text-xs bg-slate-950/40 p-4 rounded-lg border border-slate-800/80">
            <p className="text-slate-300 leading-relaxed">
              <strong>"Compression Override Detection:"</strong> Catherine Vance's group volume is expanding fast (+14.2% month-on-month), fueled by high sales performance from Elena Rostova's unilevel downline. 
            </p>
            <p className="text-slate-300 leading-relaxed">
              We recommend establishing a localized fulfillment node inside <strong>Munich, Germany</strong> as Elena Rostova's direct supplements sales have crossed the threshold value ($35k/mo), triggering tax nexus compliance requirements.
            </p>
            <div className="h-px bg-slate-800" />
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>LAST CALCULATED: 10 MIN AGO</span>
              </span>
              <span className="flex items-center space-x-1 cursor-pointer hover:underline">
                <span>OPEN DETAILED ANALYSIS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
