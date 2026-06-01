import React, { useState } from 'react';
import { 
  Network, 
  ChevronDown, 
  ChevronRight, 
  UserPlus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Layers, 
  Plus, 
  UserCheck, 
  Grid,
  Info
} from 'lucide-react';
import { NETWORK_TREE, INITIAL_DISTRIBUTORS } from '../data';
import { TreeNode, Distributor } from '../types';

export const MLMNetwork: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeNode>(NETWORK_TREE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(INITIAL_DISTRIBUTORS[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetParentId, setTargetParentId] = useState<string>('');
  
  // New distributor forms
  const [newName, setNewName] = useState('');
  const [newRank, setNewRank] = useState<'Retailer' | 'Distributor' | 'Bronze'>('Distributor');
  const [newPV, setNewPV] = useState(100);

  // Deep search in recursive tree to select a node info
  const findDistributorInfo = (id: string) => {
    const found = INITIAL_DISTRIBUTORS.find(d => d.id === id);
    if (found) {
      setSelectedDistributor(found);
    }
  };

  // Deep recursive insert to add a simulated downline node
  const recursiveAddNode = (root: TreeNode, parentId: string, newNode: TreeNode): TreeNode => {
    if (root.id === parentId) {
      const children = root.children ? [...root.children] : [];
      return {
        ...root,
        children: [...children, newNode]
      };
    }
    if (root.children) {
      return {
        ...root,
        children: root.children.map(child => recursiveAddNode(child, parentId, newNode))
      };
    }
    return root;
  };

  const handleAddDownlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !targetParentId) return;

    const pseudoId = `DST-99${Math.floor(Math.random() * 90) + 10}`;
    const newTreeNode: TreeNode = {
      id: pseudoId,
      name: newName,
      rank: newRank,
      status: 'Active',
      level: 1, // Will resolve inside node view or display level
      monthlyPV: newPV,
      monthlyGV: newPV,
    };

    // Update state tree
    const updatedTree = recursiveAddNode(treeState, targetParentId, newTreeNode);
    setTreeState(updatedTree);

    // Also inject into pseudo-distributor database list for selection lookup
    INITIAL_DISTRIBUTORS.push({
      id: pseudoId,
      name: newName,
      rank: newRank,
      status: 'Active',
      email: `${newName.toLowerCase().replace(' ', '.')}@member.org`,
      phone: "+1 (555) 018-9321",
      sponsorId: targetParentId,
      joinDate: new Date().toISOString().substring(0, 10),
      monthlyPV: newPV,
      monthlyGV: newPV,
      totalCommissions: 0.00,
      downlineCount: 0,
      location: "Active Simulation Node"
    });

    // Reset Form
    setNewName('');
    setShowAddModal(false);
  };

  // Helper colors based on MLM ranks
  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case 'Crown President': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Diamond': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Platinum': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Gold': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Silver': return 'bg-slate-300/10 text-slate-300 border-slate-400/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700/50';
    }
  };

  // Recursive Renderer component for Unilevel/Binary Tree Nodes
  const RenderNode = ({ node, depth = 0 }: { node: TreeNode; depth: number }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const hasChildren = node.children && node.children.length > 0;
    
    // Highlight match query
    const isMatched = searchQuery ? node.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;

    return (
      <div className="flex flex-col ml-6 pl-4 border-l border-slate-800/80 relative mt-2 text-slate-100 font-sans">
        
        {/* Visual horizontal offset tag */}
        <div className="absolute top-5 left-0 w-4 h-px bg-slate-800/80" />

        <div className={`flex items-center space-x-3 bg-slate-900/60 p-2.5 rounded-lg border max-w-md cursor-pointer transition-all ${
          selectedDistributor?.id === node.id 
            ? 'border-emerald-500 bg-slate-900 shadow-md shadow-emerald-900/10' 
            : isMatched 
              ? 'border-indigo-500 bg-slate-900/90' 
              : 'border-slate-800/80 hover:border-slate-700 group hover:bg-slate-900/40'
        }`}
        onClick={() => findDistributorInfo(node.id)}
        >
          {/* Collapse Icon */}
          {hasChildren ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed(!isCollapsed);
              }}
              className="p-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 cursor-pointer text-slate-400"
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <div className="w-5.5 h-px bg-slate-800 shrink-0" />
          )}

          {/* Node Avatar Initial */}
          <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex items-center justify-center font-display font-medium text-emerald-400 shrink-0 select-none">
            {node.name.charAt(0)}
          </div>

          {/* Info block */}
          <div className="flex-1 text-left min-w-[120px]">
            <p className="text-xs font-semibold leading-tight text-white group-hover:text-emerald-400 transition-colors uppercase tracking-wide">{node.name}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-[9px] font-mono border px-1.5 py-0.2 rounded ${getRankBadgeColor(node.rank)}`}>
                {node.rank}
              </span>
              <span className="text-[9px] font-mono text-slate-500">GV: ${node.monthlyGV.toLocaleString()}</span>
            </div>
          </div>

          {/* Controls toggle - Add simulator button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setTargetParentId(node.id);
              setShowAddModal(true);
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-slate-800 border border-transparent hover:border-slate-700 text-slate-400 hover:text-white transition-opacity shrink-0 cursor-pointer"
            title="Add simulated downline node"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Children Render block with collapse animations */}
        {hasChildren && !isCollapsed && (
          <div className="mt-1 flex flex-col space-y-1">
            {node.children!.map((child) => (
              <RenderNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 relative">
      
      {/* Title segment */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-5 bg-slate-900/30 rounded-xl border border-slate-800/80 gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl tracking-tight text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-emerald-400" /> Unilevel Network Tree Explorer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visualize compressed volume hierarchies, search sponsor pathways, and inject simulated downline volume nodes.
          </p>
        </div>

        {/* Search filter inline */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search distributor nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700/80 focus:border-emerald-500 focus:outline-none py-2 pl-9 pr-4 rounded-lg text-xs tracking-wide transition-all placeholder:text-slate-600 text-slate-200"
          />
        </div>
      </div>

      {/* Main Structural splits */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left Side: Tree Structure Navigator */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-5 min-h-[480px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">UNILEVEL SPONSOR MAP</span>
              <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <span>Hover over card to inspect or extend downline</span>
              </span>
            </div>

            {/* Tree Base Root rendering (Catherine Vance) */}
            <div className="overflow-x-auto py-2 -ml-6">
              <RenderNode node={treeState} depth={0} />
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 py-3 flex text-[10px] font-mono text-slate-500 gap-4">
            <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded bg-rose-500" /> <span>Crown President</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded bg-purple-500" /> <span>Diamond</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded bg-indigo-500" /> <span>Platinum</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded bg-amber-500" /> <span>Gold</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded bg-slate-400" /> <span>Silver</span></span>
          </div>
        </div>

        {/* Right Side: Distributor Full Profile Info drawer */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 h-fit text-left">
          {selectedDistributor ? (
            <div className="space-y-6">
              
              {/* Header profile details */}
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] border font-mono px-2 py-0.5 rounded-full ${getRankBadgeColor(selectedDistributor.rank)}`}>
                    {selectedDistributor.rank}
                  </span>
                  <h3 className="text-lg font-display font-semibold text-white uppercase tracking-wide mt-2">{selectedDistributor.name}</h3>
                  <p className="text-[11px] font-mono text-slate-500 tracking-wider">ID: {selectedDistributor.id}</p>
                </div>
                {selectedDistributor.avatarUrl ? (
                  <img 
                    src={selectedDistributor.avatarUrl} 
                    alt={selectedDistributor.name}
                    className="w-14 h-14 rounded-lg object-cover border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-display font-bold text-lg text-indigo-400">
                    {selectedDistributor.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* General details list */}
              <div className="space-y-2 text-xs border-y border-slate-800 py-4 font-sans text-slate-300">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 flex items-center space-x-2"><Mail className="w-3.5 h-3.5" /> <span>Email Address</span></span>
                  <span className="text-slate-200">{selectedDistributor.email}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 flex items-center space-x-2"><Phone className="w-3.5 h-3.5" /> <span>Phone Contact</span></span>
                  <span className="text-slate-200">{selectedDistributor.phone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 flex items-center space-x-2"><MapPin className="w-3.5 h-3.5" /> <span>Fulfillment Base</span></span>
                  <span className="text-slate-200">{selectedDistributor.location}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 flex items-center space-x-2"><Award className="w-3.5 h-3.5" /> <span>Sponsor Link Code</span></span>
                  <span className="text-slate-200 font-mono text-[11px]">{selectedDistributor.sponsorId || 'None (System Root)'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 flex items-center space-x-2"><UserCheck className="w-3.5 h-3.5" /> <span>Enrollment Date</span></span>
                  <span className="text-slate-200 font-mono text-[11px]">{selectedDistributor.joinDate}</span>
                </div>
              </div>

              {/* Volumes indicators */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Personal PV (This Mo.)</span>
                  <span className="text-lg font-bold font-mono text-indigo-400 mt-1 block">{selectedDistributor.monthlyPV} PV</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Group GV (This Mo.)</span>
                  <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">${selectedDistributor.monthlyGV.toLocaleString()}</span>
                </div>
              </div>

              {/* Commission Ledger summary */}
              <div className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Aggregate commissions</span>
                    <span className="text-md font-bold font-display text-white mt-0.5 block">
                      ${selectedDistributor.totalCommissions.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>{selectedDistributor.downlineCount} downline nodes</span>
                </span>
              </div>

            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 text-xs font-sans">
              Select any tree node card to inspect core MLM diagnostics
            </div>
          )}
        </div>

      </div>

      {/* Downline injection modal simulation overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in text-left">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl shadow-black relative text-slate-100">
            <h3 className="font-display font-bold text-md text-white mb-1">Simulate Downline Connection</h3>
            <p className="text-xs text-slate-500 mb-4">Adds a mock downline node underneath target parent node <span className="font-mono text-indigo-400 font-bold">{targetParentId}</span>.</p>

            <form onSubmit={handleAddDownlineSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">DISTRIBUTOR NAME</label>
                <input 
                  type="text" 
                  placeholder="e.g. Gabriel Oak"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700/80 focus:border-emerald-500 focus:outline-none p-2 rounded text-xs text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">INITIAL RANK</label>
                  <select 
                    value={newRank}
                    onChange={(e: any) => setNewRank(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none p-2 rounded text-xs text-slate-200"
                  >
                    <option value="Distributor">Distributor</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Retailer">Retailer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">MONTHLY PV</label>
                  <input 
                    type="number"
                    value={newPV}
                    onChange={(e) => setNewPV(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none p-2 rounded text-xs font-mono text-slate-200"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-3 border-t border-slate-800 mt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 p-2 rounded bg-slate-950 border border-slate-800 hover:bg-slate-850 hover:text-white text-xs font-mono text-slate-400 transition-colors cursor-pointer text-center"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="w-1/2 p-2 rounded bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-mono text-emerald-400 hover:text-white transition-colors cursor-pointer text-center"
                >
                  INJECT NODE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
