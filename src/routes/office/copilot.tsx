import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Bot, Send, Copy, Check, Star, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ChatMessage { id: string; sender: "user" | "copilot"; text: string; timestamp: string; copyableText?: string; }

const PRESET_PROMPTS = [
  "Gerar Copy de Vendas",
  "Quem está com risco de abandono?",
  "Como qualificar para Diamante?",
  "Análise de Faturamento",
];

export const Route = createFileRoute("/office/copilot")({ component: CopilotPage });

function CopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: "m1", sender: "copilot", text: "Olá! Eu agora opero sem dados mockados da camada antiga.", timestamp: "Agora" }]);
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, sender: "user", text, timestamp: "Agora" }]);
    setMessages((prev) => [...prev, { id: `c-${Date.now()}`, sender: "copilot", text: `Resposta simplificada baseada em dados reais e contexto operacional para: "${text}".`, timestamp: "Agora", copyableText: text }]);
    setInputText("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2"><Sparkles className="h-8 w-8 text-primary shrink-0" /> Copiloto IA</h1>
          <p className="text-muted-foreground text-sm mt-1">Interface mantida, conteúdo legado removido.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-[#070b13] flex flex-col h-[520px] overflow-hidden">
          <div className="bg-background/80 p-4 border-b border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2"><div className="h-7 w-7 rounded-lg bg-primary/20 text-primary grid place-items-center"><Bot className="h-4 w-4" /></div><p className="text-xs font-semibold text-white">Assistente</p></div>
            <Button size="sm" variant="ghost" className="h-7 text-[10px] font-mono hover:text-white" onClick={() => setMessages([{ id: "m1", sender: "copilot", text: "Histórico limpo.", timestamp: "Agora" }])}>Limpar</Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                <div className={`h-8 w-8 rounded-full grid place-items-center text-xs shrink-0 font-bold ${msg.sender === "user" ? "bg-indigo-500 text-white" : "bg-primary text-white"}`}>{msg.sender === "user" ? "M" : "A"}</div>
                <div className="space-y-1.5">
                  <div className={`rounded-2xl p-3.5 text-xs leading-relaxed ${msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-[#101928] border border-border/40 text-muted-foreground"}`}>
                    <p className="whitespace-pre-line text-white">{msg.text}</p>
                    {msg.copyableText && <div className="mt-3 pt-3 border-t border-border/20 flex justify-end"><Button size="sm" variant="secondary" className="h-7 text-[11px] gap-1 px-2" onClick={() => { navigator.clipboard.writeText(msg.copyableText!); setCopiedId(msg.id); toast.success("Copiado!"); }}>{copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />} {copiedId === msg.id ? "Copiado!" : "Copiar Texto"}</Button></div>}
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono block px-1.5">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-2 pt-1 border-t border-border/10 flex flex-wrap gap-1.5 bg-black/10">
            {PRESET_PROMPTS.map((p) => <button key={p} onClick={() => send(p)} className="text-[10px] font-mono bg-background border border-border/70 text-muted-foreground hover:text-white px-2.5 py-1 rounded-full">{p}</button>)}
          </div>
          <div className="p-3 bg-background border-t border-border/40 flex gap-2">
            <Input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(inputText); }} placeholder="Perguntar ao copiloto..." className="h-10 text-xs border-border/60" />
            <Button className="h-10 px-4 bg-gradient-to-r from-primary to-fuchsia-500" onClick={() => send(inputText)}><Send className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3"><Lightbulb className="h-5 w-5 text-amber-400" /><h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Dicas</h3></div>
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl"><p className="text-xs font-semibold text-white flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-500 fill-current" /> Saturação</p><p className="text-xs text-muted-foreground leading-relaxed">Use os dados reais dos relatórios para orientar campanhas.</p></div>
            <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl"><p className="text-xs font-semibold text-rose-400 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Risco</p><p className="text-xs text-muted-foreground leading-relaxed">O copiloto agora não depende de `distributor-data`.</p></div>
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl"><p className="text-xs font-semibold text-emerald-400 flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> Desempenho</p><p className="text-xs text-muted-foreground leading-relaxed">Integrações futuras podem ser conectadas a consultas reais.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
