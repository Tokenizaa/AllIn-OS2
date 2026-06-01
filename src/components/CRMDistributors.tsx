import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MessageSquareCode, 
  UserCheck, 
  Clock, 
  AlertCircle, 
  X,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';
import { INITIAL_DISTRIBUTORS } from '../data';
import { Distributor, Rank } from '../types';

export const CRMDistributors: React.FC = () => {
  const [distributors, setDistributors] = useState<Distributor[]>(INITIAL_DISTRIBUTORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Pending' | 'Inactive'>('All');
  const [rankFilter, setRankFilter] = useState<string>('All');
  const [selectedDist, setSelectedDist] = useState<Distributor | null>(INITIAL_DISTRIBUTORS[0]);
  
  // Custom distributor interaction log
  const [logMessage, setLogMessage] = useState('');
  const [interactionLogs, setInteractionLogs] = useState<Record<string, { date: string, type: string, note: string }[]>>({
    "DST-001": [
      { date: "2026-06-01 10:15", type: "Email", note: "Sent corporate board deck on EU expansion rules" },
      { date: "2026-05-20 14:02", type: "SMS", note: "Confirmed attendance at Florida MLM Summit" }
    ],
    "DST-002": [
      { date: "2026-05-28 09:12", type: "Call", note: "Spoke with Marcus regarding team volume override qualifications" }
    ]
  });

  const handleLogInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logMessage.trim() || !selectedDist) return;

    const newLog = {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: "System Exec",
      note: logMessage
    };

    setInteractionLogs(prev => ({
      ...prev,
      [selectedDist.id]: [newLog, ...(prev[selectedDist.id] || [])]
    }));

    setLogMessage('');
  };

  // Filter pipeline
  const filteredDistributors = distributors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || d.status === activeTab;
    const matchesRank = rankFilter === 'All' || d.rank === rankFilter;
    return matchesSearch && matchesTab && matchesRank;
  });

  const getRankStyle = (rank: Rank) => {
    switch (rank) {
      case 'Crown President': return 'border-rose-500/30 text-rose-400 bg-rose-500/5';
      case 'Diamond': return 'border-purple-500/30 text-purple-400 bg-purple-500/5';
      case 'Platinum': return 'border-indigo-500/30 text-indigo-400 bg-indigo-505/5';
      case 'Gold': return 'border-amber-500/30 text-amber-400 bg-amber-500/5';
      default: return 'border-slate-800 text-slate-300 bg-slate-900/50';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      
      {/* Title segment */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-5 bg-slate-900/30 rounded-xl border border-slate-800/80 gap-4 text-left">
        <div>
          <h2 className="font-display font-bold text-2xl tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-450" /> Distributor Team & CRM directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Audit team onboarding pipeline, track group PV metrics, and manage custom client CRM notes logs securely.
          </p>
        </div>

        {/* Search & Filter bar combined */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search by ID, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 focus:border-sky-500 focus:outline-none py-2 pl-9 pr-4 rounded-lg text-xs placeholder:text-slate-600 text-slate-200"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 ">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={rankFilter}
              onChange={(e) => setRankFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none"
            >
              <option value="All">All Ranks</option>
              <option value="Crown President">Crown President</option>
              <option value="Diamond">Diamond</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
              <option value="Distributor">Distributor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-800 gap-1 select-none">
        {(['All', 'Active', 'Pending', 'Inactive'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-mono font-medium transition-all cursor-pointer relative ${
              activeTab === tab 
                ? 'text-sky-400 font-semibold' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.toUpperCase()} ({
              tab === 'All' 
                ? distributors.length 
                : distributors.filter(d => d.status === tab).length
            })
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded" />
            )}
          </button>
        ))}
      </div>

      {/* Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Table of Roster */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="p-4">Distributor</th>
                  <th className="p-4">Rank</th>
                  <th className="p-4">Volume (PV/GV)</th>
                  <th className="p-4">Commissions</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDistributors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No matching distributors found in this segment
                    </td>
                  </tr>
                ) : (
                  filteredDistributors.map((d) => (
                    <tr 
                      key={d.id}
                      onClick={() => setSelectedDist(d)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        selectedDist?.id === d.id ? 'bg-slate-800/65 border-l-2 border-sky-400' : ''
                      }`}
                    >
                      {/* Name / ID info */}
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {d.avatarUrl ? (
                            <img src={d.avatarUrl} alt={d.name} className="w-8 h-8 rounded object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-slate-950 border border-slate-850 flex items-center justify-center font-display font-semibold text-sky-400">
                              {d.name.charAt(0)}
                            </div>
                          )}
                          <div className="leading-tight">
                            <p className="font-semibold text-slate-200">{d.name}</p>
                            <p className="font-mono text-[9px] text-slate-500 mt-0.5">{d.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Rank tag */}
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getRankStyle(d.rank)}`}>
                          {d.rank}
                        </span>
                      </td>

                      {/* PV/GV metrics */}
                      <td className="p-4 font-mono">
                        <span className="text-indigo-400">{d.monthlyPV} PV</span>
                        <span className="text-slate-500 mx-1">/</span>
                        <span className="text-emerald-400">${d.monthlyGV.toLocaleString()} GV</span>
                      </td>

                      {/* Accumulated Commission */}
                      <td className="p-4 font-mono font-medium text-slate-200">
                        ${d.totalCommissions.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* status tag */}
                      <td className="p-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                          d.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : d.status === 'Pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                              : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${
                            d.status === 'Active' ? 'bg-emerald-400' : d.status === 'Pending' ? 'bg-amber-400' : 'bg-rose-500'
                          }`} />
                          <span>{d.status}</span>
                        </span>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer action bar */}
          <div className="border-t border-slate-800 p-4 bg-slate-950/20 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Showing {filteredDistributors.length} of {distributors.length} accounts</span>
            <button className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-white px-3 py-1.5 rounded transition-all cursor-pointer">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>EXPORT ROSTER XLS</span>
            </button>
          </div>
        </div>

        {/* Right: CRM Communications Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between text-left">
          {selectedDist ? (
            <div className="space-y-5 h-full flex flex-col justify-between">
              
              <div>
                {/* Distributor Card Header */}
                <div className="flex bg-slate-950/40 p-3 rounded-lg border border-slate-800 items-start space-x-3 mb-4">
                  <div className="w-10 h-10 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-display font-medium text-indigo-400 shrink-0">
                    {selectedDist.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">{selectedDist.name}</h3>
                    <p className="text-[10px] font-mono text-slate-500">{selectedDist.id} • {selectedDist.location}</p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1.5">
                      <span className="flex items-center space-x-1"><Mail className="w-3 h-3 text-slate-500" /> <span className="truncate max-w-[100px]">{selectedDist.email}</span></span>
                      <span className="flex items-center space-x-1"><Phone className="w-3 h-3 text-slate-500" /> <span>{selectedDist.phone}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 border-b border-slate-800 pb-2 mb-3">
                  <span>CRM LOGGED CONTACT CHATS</span>
                  <span className="text-sky-400 font-bold">SECURE INTEGRATIONS</span>
                </div>

                {/* Scrollable logs */}
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {(!interactionLogs[selectedDist.id] || interactionLogs[selectedDist.id].length === 0) ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      No registered CRM interactions logged for this member. Use the control form below to record notes.
                    </div>
                  ) : (
                    interactionLogs[selectedDist.id].map((log, index) => (
                      <div key={index} className="p-3 bg-slate-950/60 rounded border border-slate-800/80 font-sans text-xs">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                          <span className="text-slate-400 uppercase font-bold bg-slate-900 border border-slate-800/65 px-1.5 rounded">{log.type}</span>
                          <span>{log.date}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed leading-[1.4]">{log.note}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Interaction Notes Submission Form */}
              <form onSubmit={handleLogInteraction} className="space-y-2.5 pt-4 border-t border-slate-800 mt-auto bg-slate-900">
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">Record Operational Note</label>
                <div className="relative">
                  <textarea
                    placeholder="Enter discussion logs, custom PV coaching targets, or support overrides notes..."
                    value={logMessage}
                    onChange={(e) => setLogMessage(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 focus:outline-none p-2.5 rounded text-xs text-slate-200 placeholder:text-slate-600 resize-none font-sans"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 text-sky-450 hover:text-white rounded font-mono text-xs font-semibold cursor-pointer transition-all"
                >
                  SAVE CRM ENTRY NOTE
                </button>
              </form>

            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 text-xs font-sans">
              Select any row item from your roster to audit their CRM logs
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
