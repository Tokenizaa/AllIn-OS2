import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Terminal, 
  Trash2, 
  RefreshCw, 
  Boxes, 
  LineChart, 
  Lightbulb, 
  Check,
  AlertTriangle
} from 'lucide-react';
import { CopilotMessage } from '../types';

export const CopilotPanel: React.FC = () => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I am Gemini Pro, your integrated AI Operations Advisor. I monitor ALLIN OS performance registers, unilevel volumes, Shopify API linkages, and commission distributions.\n\nAsk me anything or use one of the quick executive actions below.",
      timestamp: "2026-06-01 20:00"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Predefined smart replies depending on subject
  const getSimulatedResponse = (input: string): string => {
    const text = input.toLowerCase();
    
    if (text.includes('diamond') || text.includes('rank')) {
      return `### Diamond Rank Qualification Analysis:
To advance to **Diamond** rank in the ALLIN commission override plan, the network must meet the following matrix criteria:

1. **Group Volume (GV):** Accumulate a minimum of **$50,000.00** in group overrides volume within the active monthly cycle.
2. **Personal Volume (PV):** Maintain at least **500 PV** in direct personal sales.
3. **Sponsorship Baseline:** Sponser a minimum of **3 active lines**, each containing at least one qualified **Platinum** leader.

**Active Status check for Marcus Aurelius (DST-002):**
- Group GV: **$62,000.00** [MET]
- Personal PV: **800 PV** [MET]
- Status: **Awaiting manual board approval (Action pending on dashboard)**.`;
    }

    if (text.includes('catherine') || text.includes('vance') || text.includes('downline')) {
      return `### Catherine Vance (DST-001) Organization Highlights:
Catherine Vance holds the top root position inside the ALLIN unilevel hierarchy as a qualified **Crown President**.

**Downline structure analysis:**
- **Active Node count:** 154 registered distributors.
- **Monthly GV pool:** $145,000.00 representing 62% of aggregate MAINNET volume.
- **Top Legs:**
  1. *Elena Rostova (Diamond):* $78,000 GV. Exceptional Supplements product adoption inside EU.
  2. *Marcus Aurelius (Diamond):* $62,000 GV. Dominates E-Commerce Fastpacks in US markets.

**Coaching Recommendation:**
Elena Rostova's group is expanding beyond logistics. Advise Catherine to establish localized EU shipping hubs to lower import duties on *NeuroMax Bio-Noortropic Elite*.`;
    }

    if (text.includes('shopify') || text.includes('sku') || text.includes('sync')) {
      return `### Shopify API Webhook Synchronicity:
The Shopify connector is currently operational on **Oauth 2.0 gateway (INT-03)**.

**Diagnostic check:**
- **Status:** Connected
- **SKU mapping:** 5 active catalog items matching Shopify inventory registers perfectly.
- **Latency check:** Real-time webhooks dispatching in **19ms**.

*Variance Warning:* Direct supplements checkouts on SKU **NMX-BIO-01** have seen a minor inventory mismatch regarding stock quantities (Vite buffer is showing 1240 items while Shopify main branch shows 1238). This is harmless, but clicking **RESOLVE** on the dashboard executive panel will hard-override the sync buffer.`;
    }

    return `### Executive AI Advisory:
I have analyzed your request regarding **"${input}"** against active system parameters.

**System Logs Diagnostics:**
- All unilevel override rules are matching security compliance.
- Wallet ledger assets have passed automated dual-entry checks.
- Aggregate cloud latency is standard (39ms).

Please let me know if you would like me to draft direct team bulletins, write a commission override preview calculation, or inspect your payment gateways.`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: CopilotMessage = {
      id: Math.random().toString(),
      role: "user",
      content: inputText,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate thinking and streaming delay
    setTimeout(() => {
      const systemReply: CopilotMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: getSimulatedResponse(userMessage.content),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setMessages(prev => [...prev, systemReply]);
      setIsTyping(false);
    }, 1500);
  };

  const executeQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Ledger registers cleared. I am ready to process new operations advisory prompts.",
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      }
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 flex flex-col h-[calc(100vh-140px)]">
      
      {/* Top Header info */}
      <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-slate-800/80 shrink-0 text-left">
        <div>
          <h2 className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" /> Executive AI Copilot Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Command Center powered by Gemini Pro to inspect MLM commission structures, SKU syncs, and tax compliance.
          </p>
        </div>
        
        <button 
          onClick={clearChat}
          className="p-1.5 rounded hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-rose-450 transition-colors cursor-pointer"
          title="Clear session messages"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main chat interface splits */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        
        {/* Left column: Quick Actions Prompt Box */}
        <div className="space-y-4 lg:col-span-1 border border-slate-800 bg-slate-900/40 p-4 rounded-xl text-left flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[10.5px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>COGNITIVE ACTIONS MATRIX</span>
            </div>

            <div className="space-y-2 font-sans">
              <button 
                onClick={() => executeQuickPrompt("Simulate Diamond Qualification requirements")}
                className="w-full text-left p-2.5 rounded bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-950 text-xs text-slate-300 transition-colors flex items-start gap-2 group cursor-pointer"
              >
                <Boxes className="w-3.5 h-3.5 mt-0.5 text-purple-400 shrink-0" />
                <span className="group-hover:text-white transition-colors">Show Diamond Qualification Matrix</span>
              </button>

              <button 
                onClick={() => executeQuickPrompt("Audit Catherine Vance's unilevel downline volumes")}
                className="w-full text-left p-2.5 rounded bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-950 text-xs text-slate-300 transition-colors flex items-start gap-2 group cursor-pointer"
              >
                <LineChart className="w-3.5 h-3.5 mt-0.5 text-purple-400 shrink-0" />
                <span className="group-hover:text-white transition-colors">Audit Catherine Vance's Downline</span>
              </button>

              <button 
                onClick={() => executeQuickPrompt("Inspect Shopify SKU sync mapping logs")}
                className="w-full text-left p-2.5 rounded bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-950 text-xs text-slate-300 transition-colors flex items-start gap-2 group cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 mt-0.5 text-purple-400 shrink-0" />
                <span className="group-hover:text-white transition-colors">Inspect Shopify SKU alignment</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950/40 p-3 rounded border border-slate-850 text-[10px] font-mono text-slate-500 leading-relaxed mt-4">
            Gemini parses uncompressed unilevel databases, matches rank advancement rules, and generates bullet points for localized shipping nodes automatically.
          </div>
        </div>

        {/* Right column: Interactive chat stream container */}
        <div className="lg:col-span-3 border border-slate-800 bg-slate-900 rounded-xl flex flex-col justify-between overflow-hidden relative">
          
          {/* Scrollable messages bubble board */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 min-h-0 text-left">
            {messages.map((m) => {
              const isAi = m.role === 'assistant';
              return (
                <div 
                  key={m.id} 
                  className={`flex items-start space-x-3.5 max-w-2xl text-xs font-sans ${isAi ? '' : 'ml-auto flex-row-reverse space-x-reverse'}`}
                >
                  {/* Chat Avatar */}
                  <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center font-display font-bold border ${
                    isAi ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                  }`}>
                    {isAi ? 'GP' : 'ME'}
                  </div>

                  {/* Bubble Content */}
                  <div className={`p-4 rounded-xl leading-relaxed whitespace-pre-line border cursor-text selection:bg-purple-550 selection:text-white select-text ${
                    isAi ? 'bg-slate-950/40 border-slate-800/80 text-slate-200' : 'bg-indigo-500/5 border-indigo-500/15 text-slate-100'
                  }`}>
                    {/* Render basic markdown markdown lists appropriately */}
                    {m.content.split('\n').map((line, ix) => {
                      if (line.startsWith('### ')) {
                        return <h4 key={ix} className="font-display font-semibold text-white uppercase tracking-wider text-[11px] mb-2">{line.replace('### ', '')}</h4>;
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <strong key={ix} className="block text-white text-[11.5px] mt-2 mb-1 uppercase font-mono">{line.replace(/\*\*/g, '')}</strong>;
                      }
                      return <p key={ix} className="leading-relaxed mt-1 text-slate-300 text-[11.5px]">{line}</p>;
                    })}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center space-x-3 text-slate-500 font-mono text-[10px]">
                <div className="flex space-x-1 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-delay-75" />
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-delay-150" />
                </div>
                <span>Gemini Pro calculating downline matrices...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form input console bottom area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center space-x-3 shrink-0">
            <input 
              type="text"
              placeholder="Ask anything about MLM unilevels, rank advancings, payouts, tax compliance..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-purple-500 focus:outline-none p-2.5 rounded-lg text-xs placeholder:text-slate-600 text-slate-200 font-sans"
              disabled={isTyping}
              required
            />
            <button
              type="submit"
              className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white transition-all cursor-pointer shrink-0 disabled:opacity-50"
              disabled={isTyping}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
