import React, { useState } from 'react';
import { 
  Sliders, 
  Database, 
  Globe2, 
  RefreshCw, 
  Power, 
  ShieldAlert, 
  Plus, 
  FolderLock, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { INITIAL_INTEGRATIONS } from '../data';
import { SystemIntegration } from '../types';

export const SystemModule: React.FC = () => {
  const [integrations, setIntegrations] = useState<SystemIntegration[]>(INITIAL_INTEGRATIONS);
  const [syncsLoading, setSyncsLoading] = useState<Record<string, boolean>>({});
  
  // Custom unilevel override rules
  const [rules, setRules] = useState([
    { id: 1, title: 'Uncompressed Direct Generation limits overrides', desc: 'Sponsors must carry 500 PV minimum to hold override overrides on Generation 3 downlines.', active: true },
    { id: 2, title: 'EU VAT tax nexus threshold matrix guidelines', desc: 'Auto-flags fulfillment nodes when local group sales cross $35k threshold values.', active: true },
    { id: 3, title: 'Diamond rank sponsor alignment validation', desc: 'Validates presence of 2 Platinum sponsors inside downline sponsor chains.', active: false }
  ]);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');

  const toggleConnection = (id: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === id) {
        const isConnected = integration.status === 'Connected';
        return {
          ...integration,
          status: isConnected ? 'Disconnected' : 'Connected',
          details: isConnected ? 'Disconnected manually by corporate administrator.' : 'Gateway handshake validated. Producing active dual logs.'
        };
      }
      return integration;
    }));
  };

  const executeSync = (id: string) => {
    setSyncsLoading(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setSyncsLoading(prev => ({ ...prev, [id]: false }));
      setIntegrations(prev => prev.map(integration => {
        if (integration.id === id) {
          return {
            ...integration,
            lastSync: new Date().toISOString()
          };
        }
        return integration;
      }));
    }, 1500);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTitle.trim() || !newRuleDesc.trim()) return;

    setRules([
      ...rules,
      {
        id: rules.length + 1,
        title: newRuleTitle,
        desc: newRuleDesc,
        active: true
      }
    ]);

    setNewRuleTitle('');
    setNewRuleDesc('');
  };

  const toggleRule = (id: number) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      
      {/* Title segment */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-5 bg-slate-900/30 rounded-xl border border-slate-800/80 gap-4 text-left">
        <div>
          <h2 className="font-display font-bold text-2xl tracking-tight text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-slate-400" /> Platform Integrations & System Modules
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Toggle API credentials connectivity, verify sync timestamps across Shopify storefront logs, and structure automated network overrides compliance rule matrices.
          </p>
        </div>
      </div>

      {/* Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left: Active API Connectors List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center font-mono text-[10px] text-slate-500 border-b border-slate-800 pb-2 mb-2">
            <span className="uppercase">Corporate API plugins ({integrations.length})</span>
            <span className="text-emerald-400">Mainnet routing channels secure</span>
          </div>

          <div className="space-y-3">
            {integrations.map((i) => {
              const isConnected = i.status === 'Connected';
              const isError = i.status === 'Error';
              const isLoading = syncsLoading[i.id];

              return (
                <div key={i.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-start justify-between text-left">
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-400 mt-0.5 select-none shrink-0">
                      <Database className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-semibold text-slate-200">{i.name}</h4>
                        <span className={`px-1.5 py-0.2 rounded font-mono text-[8.5px] uppercase ${
                          isConnected 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : isError 
                              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                              : 'bg-slate-800 text-slate-550 border border-slate-700/50'
                        }`}>
                          {i.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-wide">PLUGIN CLASS: {i.type} | LAST SYNC: {i.lastSync.substring(11, 16)} UTC</p>
                      <p className="text-[11px] text-slate-300 mt-2 font-sans leading-relaxed">{i.details}</p>
                    </div>
                  </div>

                  {/* Plugin Actions bar */}
                  <div className="flex items-center space-x-1 shrink-0 ml-3">
                    <button 
                      onClick={() => executeSync(i.id)}
                      disabled={isLoading || !isConnected}
                      className="p-1.5 rounded hover:bg-slate-800 border border-slate-850 hover:border-slate-700 font-mono text-[10px] text-slate-400 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
                      title="Request hard Shopify synchronization"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button 
                      onClick={() => toggleConnection(i.id)}
                      className={`p-1.5 rounded border font-mono text-[10px] cursor-pointer transition-all ${
                        isConnected 
                          ? 'hover:bg-rose-500/10 border-slate-850 hover:border-rose-500/30 text-rose-455' 
                          : 'hover:bg-emerald-500/10 border-slate-850 hover:border-emerald-500/30 text-emerald-455'
                      }`}
                      title={isConnected ? 'Disconnect plugin link' : 'Establish plugin gateway'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Rules creator Matrix */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 text-left flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 select-none">
              <h3 className="text-sm font-semibold text-slate-200">Override Matrix Rulebuilder</h3>
              <FolderLock className="w-4 h-4 text-indigo-400" />
            </div>

            {/* Custom Rule list */}
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="p-3 bg-slate-950/60 rounded border border-slate-850 font-sans text-xs flex justify-between gap-4">
                  <div>
                    <h5 className="font-semibold text-slate-205 leading-snug">{rule.title}</h5>
                    <p className="text-[10.5px] text-slate-500 mt-1 leading-relaxed">{rule.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggleRule(rule.id)}
                    className={`h-6 shrink-0 font-mono text-[9px] px-2 rounded border cursor-pointer uppercase ${
                      rule.active 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 font-bold' 
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    {rule.active ? 'Active' : 'Muted'}
                  </button>
                </div>
              ))}
            </div>

            {/* New Rule submitter Form */}
            <form onSubmit={handleAddRule} className="pt-5 border-t border-slate-800 mt-5 space-y-3.5">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">Draft custom compliance rule-block</p>
              
              <div>
                <input 
                  type="text" 
                  placeholder="Rule short title..."
                  value={newRuleTitle}
                  onChange={(e) => setNewRuleTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-805 focus:border-slate-500 focus:outline-none p-2 rounded text-xs text-slate-200 placeholder:text-slate-650"
                  required
                />
              </div>
              
              <div>
                <textarea
                  placeholder="Detail formula or unilevel overrides targets..."
                  value={newRuleDesc}
                  onChange={(e) => setNewRuleDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-805 focus:border-slate-500 focus:outline-none p-2 rounded text-xs text-slate-200 placeholder:text-slate-655 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 hover:text-white rounded font-mono text-xs font-semibold cursor-pointer transition-all"
              >
                DEPLOY COMPLIANCE RULE BLOCK
              </button>
            </form>
          </div>

          <div className="bg-slate-950/20 border border-slate-850 p-3 rounded-lg flex items-center space-x-3 text-[11px] font-mono text-slate-500 mt-5">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Rules are compiled at edge runtime, preventing unilevel override compression leaks automatically.</span>
          </div>

        </div>

      </div>

    </div>
  );
};
