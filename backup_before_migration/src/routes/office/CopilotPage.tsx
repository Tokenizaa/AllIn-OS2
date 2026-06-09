import { useState, useEffect } from "react";
import { Sparkles, Bot, Send, Copy, Check, Star, AlertTriangle, TrendingUp, Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCopilot } from "@/hooks/copilot/useCopilot";
import { CopilotAction, CopilotSource } from "@/services/copilot.service";

interface ChatMessage { 
  id: string; 
  sender: "user" | "copilot"; 
  text: string; 
  timestamp: string; 
  copyableText?: string;
  actions?: CopilotAction[];
  sources?: CopilotSource[];
  confidence?: number;
  warnings?: string[];
}

const PRESET_PROMPTS = [
  "Gerar Copy de Vendas",
  "Quem está com risco de abandono?",
  "Como qualificar para Diamante?",
  "Análise de Faturamento",
];

export function CopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState<"checking" | "online" | "offline">("checking");

  const { 
    isLoading, 
    error, 
    sendMessage, 
    startNewConversation,
    checkHealth 
  } = useCopilot();

  useEffect(() => {
    // Check Ollama health on mount
    checkHealthStatus();
  }, []);

  const checkHealthStatus = async () => {
    setOllamaStatus("checking");
    const health = await checkHealth();
    setOllamaStatus(health.ollama ? "online" : "offline");
    
    if (!health.ollama) {
      toast.error("Ollama não está disponível. Verifique se o serviço está rodando em localhost:11434");
    }
  };

  const send = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg: ChatMessage = { 
      id: `u-${Date.now()}`, 
      sender: "user", 
      text, 
      timestamp: new Date().toLocaleTimeString('pt-BR') 
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    try {
      const response = await sendMessage({ 
        message: text,
        scope: 'office',
        route: '/office/copilot'
      });

      // Add assistant message
      const assistantMsg: ChatMessage = { 
        id: `c-${Date.now()}`, 
        sender: "copilot", 
        text: response.answer,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        copyableText: text,
        actions: response.actions,
        sources: response.sources,
        confidence: response.confidence,
        warnings: response.warnings
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        sender: "copilot",
        text: `Erro ao processar mensagem: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        warnings: ["Ollama pode não estar disponível"]
      };
      setMessages((prev) => [...prev, errorMsg]);
      toast.error("Erro ao enviar mensagem para o copiloto");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2"><Sparkles className="h-8 w-8 text-primary shrink-0" /> Copiloto IA</h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
              ollamaStatus === 'online' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              ollamaStatus === 'offline' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {ollamaStatus === 'checking' && <Loader2 className="h-3 w-3 animate-spin" />}
              {ollamaStatus === 'online' && <Check className="h-3 w-3" />}
              {ollamaStatus === 'offline' && <AlertTriangle className="h-3 w-3" />}
              {ollamaStatus === 'checking' ? 'Verificando Ollama...' :
               ollamaStatus === 'online' ? 'Ollama Online' :
               'Ollama Offline'}
            </span>
            <span>·</span>
            <span>Integração real com Ollama + TinyLlama</span>
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => { startNewConversation(); setMessages([]); }}>
          Nova Conversa
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-[#070b13] flex flex-col h-[520px] overflow-hidden">
          <div className="bg-background/80 p-4 border-b border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2"><div className="h-7 w-7 rounded-lg bg-primary/20 text-primary grid place-items-center"><Bot className="h-4 w-4" /></div><p className="text-xs font-semibold text-white">Assistente</p></div>
            <Button size="sm" variant="ghost" className="h-7 text-[10px] font-mono hover:text-white" onClick={() => setMessages([{ id: "m1", sender: "copilot", text: "Histórico limpo.", timestamp: "Agora" }])}>Limpar</Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-primary/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Comece uma conversa com o copiloto</p>
                <p className="text-xs text-muted-foreground mt-1">Use os prompts sugeridos abaixo ou faça sua própria pergunta</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                <div className={`h-8 w-8 rounded-full grid place-items-center text-xs shrink-0 font-bold ${msg.sender === "user" ? "bg-indigo-500 text-white" : "bg-primary text-white"}`}>{msg.sender === "user" ? "M" : "A"}</div>
                <div className="space-y-1.5 flex-1">
                  <div className={`rounded-2xl p-3.5 text-xs leading-relaxed ${msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-[#101928] border border-border/40 text-muted-foreground"}`}>
                    <p className="whitespace-pre-line text-white">{msg.text}</p>
                    {msg.copyableText && <div className="mt-3 pt-3 border-t border-border/20 flex justify-end"><Button size="sm" variant="secondary" className="h-7 text-[11px] gap-1 px-2" onClick={() => { navigator.clipboard.writeText(msg.copyableText!); setCopiedId(msg.id); toast.success("Copiado!"); }}>{copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />} {copiedId === msg.id ? "Copiado!" : "Copiar Texto"}</Button></div>}
                  </div>
                  
                  {msg.warnings && msg.warnings.length > 0 && (
                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2">
                      {msg.warnings.map((warning, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[10px] text-amber-400">
                          <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                          <span>{warning}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
                      <p className="text-[10px] font-semibold text-primary mb-1">Fontes:</p>
                      {msg.sources.map((source, idx) => (
                        <div key={idx} className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <span className="text-primary">•</span>
                          <span>{source.label}</span>
                          {source.record_count && <span className="text-muted-foreground/60">({source.record_count} registros)</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.actions.map((action, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant="outline"
                          className="h-7 text-[10px] gap-1.5"
                          onClick={() => {
                            if (action.type === 'navigate' && action.target) {
                              window.location.href = action.target;
                            } else {
                              toast.info(`Ação: ${action.label}`);
                            }
                          }}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  {msg.confidence !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 flex-1 bg-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all" 
                          style={{ width: `${msg.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-muted-foreground font-mono">{Math.round(msg.confidence * 100)}% confiança</span>
                    </div>
                  )}

                  <span className="text-[9px] text-muted-foreground font-mono block px-1.5">{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="h-8 w-8 rounded-full bg-primary text-white grid place-items-center text-xs shrink-0 font-bold">A</div>
                <div className="space-y-1.5">
                  <div className="rounded-2xl p-3.5 bg-[#101928] border border-border/40">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 text-primary animate-spin" />
                      <span className="text-xs text-muted-foreground">Processando com Ollama...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl"><p className="text-xs font-semibold text-white flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-500 fill-current" /> Dados Reais</p><p className="text-xs text-muted-foreground leading-relaxed">O copiloto usa dados reais do Supabase: clientes, pedidos, pagamentos, rede, analytics.</p></div>
            <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl"><p className="text-xs font-semibold text-rose-400 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Ollama Local</p><p className="text-xs text-muted-foreground leading-relaxed">Requer Ollama rodando em localhost:11434 com modelo tinyllama instalado.</p></div>
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl"><p className="text-xs font-semibold text-emerald-400 flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> RBAC</p><p className="text-xs text-muted-foreground leading-relaxed">Todas as consultas respeitam as permissões do usuário (admin, operator, distributor).</p></div>
            <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl"><p className="text-xs font-semibold text-blue-400 flex items-center gap-1"><Bot className="h-3.5 w-3.5" /> TinyLlama</p><p className="text-xs text-muted-foreground leading-relaxed">Modelo leve e rápido, otimizado para respostas concisas com contexto operacional.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
