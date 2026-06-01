import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Binary, 
  Users, 
  ShoppingBag, 
  Wallet, 
  Sparkles, 
  Sliders,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Terminal,
  HelpCircle,
  Menu
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      label: "Executive Dashboard",
      icon: LayoutDashboard,
      to: "/",
      color: "text-indigo-400 bg-indigo-500/10",
      description: "Business analytics and KPIs"
    },
    {
      label: "MLM Network Tree",
      icon: Binary,
      to: "/network",
      color: "text-emerald-400 bg-emerald-500/10",
      description: "Unilevel network visualization"
    },
    {
      label: "CRM Distributors",
      icon: Users,
      to: "/crm",
      color: "text-sky-400 bg-sky-500/10",
      description: "Prospects and downline directories"
    },
    {
      label: "Comercial Store",
      icon: ShoppingBag,
      to: "/commercial",
      color: "text-amber-400 bg-amber-500/10",
      description: "E-commerce product configurations"
    },
    {
      label: "Finance Ledger",
      icon: Wallet,
      to: "/finance",
      color: "text-rose-400 bg-rose-500/10",
      description: "Payout ledger and commissions"
    },
    {
      label: "Executive AI Copilot",
      icon: Sparkles,
      to: "/copilot",
      color: "text-purple-400 bg-purple-500/10",
      description: "Gemini-powered business expert"
    },
    {
      label: "System Modules",
      icon: Sliders,
      to: "/system",
      color: "text-slate-400 bg-slate-500/10",
      description: "API connectors and rules"
    }
  ];

  return (
    <aside 
      className={`relative h-[calc(100vh-53px)] border-r border-slate-800 bg-slate-950 flex flex-col justify-between transition-all duration-300 font-sans select-none z-30 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Menu Area */}
      <div className="flex-1 py-4 overflow-y-auto px-3 space-y-5">
        
        {/* Switcher Indicator */}
        {!isCollapsed && (
          <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800/60 mb-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="leading-tight text-left">
                <p className="text-[10px] text-slate-500 font-mono font-semibold uppercase tracking-wider">Operational Node</p>
                <p className="text-[12px] text-slate-200 font-medium font-sans">ALLIN MAINNET-01</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.to || (item.to !== '/' && currentPath.startsWith(item.to));
            
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive 
                    ? 'bg-slate-800/80 text-white border-l-2 border-emerald-500 shadow-md shadow-black/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className={`p-1 rounded-md shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                  isActive ? 'bg-slate-900 border border-slate-800' : 'bg-transparent'
                }`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <span className="block truncate text-[12px]">{item.label}</span>
                    <span className="block truncate text-[9px] text-slate-500 font-mono tracking-tight font-normal">
                      {item.description}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Area */}
      <div className="p-3 border-t border-slate-900 bg-slate-950/60">
        
        {/* Mini status indicator */}
        {!isCollapsed && (
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-slate-900/40 border border-slate-900 mb-3 text-[10px] font-mono text-slate-500">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              <span>KEEPALIVE</span>
            </span>
            <span>SECURE</span>
          </div>
        )}

        {/* Collapse button toggler */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : (
            <div className="flex items-center space-x-2 text-[11px] font-mono font-medium tracking-wide">
              <ChevronLeft className="w-4 h-4" />
              <span>COLLAPSE OS RAIL</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
