import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getCustomerLabel } from "@/lib/customer-label";

interface CustomerAutomationsTabProps {
  customer: any;
}

export function CustomerAutomationsTab({ customer }: CustomerAutomationsTabProps) {
  const [automations, setAutomations] = useState<any[]>([
    { id: "auto-1", name: "E-mail de Boas-Vindas", description: "Disparado automaticamente no instante do cadastro da conta do distribuidor.", type: "E-mail", active: true, runs: 124 },
    { id: "auto-2", name: "Alerta de Upgrade de Nível", description: "Incentiva o distribuidor enviando metas quando está próximo de atingir graduação.", type: "WhatsApp", active: true, runs: 45 },
    { id: "auto-3", name: "Detecção de Inatividade (Churn)", description: "Notifica o patrocinador associado caso o distribuidor fique mais de 25 dias sem pedidos.", type: "Sistema", active: false, runs: 0 },
    { id: "auto-4", name: "Cobrança de Renovação Periódica", description: "Dispara lembretes 30 e 15 dias antes de expirar o licenciamento ativo.", type: "SMS", active: true, runs: 12 },
    { id: "auto-5", name: "WhatsApp de Cashback de Rede", description: "Mensagem automática comunicando crédito imediato de pontos de rede no ledger.", type: "WhatsApp", active: true, runs: 312 }
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Réguas e Gatilhos de Comunicação Ativas</h3>
          <p className="text-xs text-muted-foreground">Monitore o relacionamento do distribuidor através dos disparos sistêmicos de notificação</p>
        </div>
        <Button size="sm" variant="outline" className="text-xs text-white border-white/20" onClick={() => {
          toast.success("Estatísticas de disparo limpas e reiniciadas!");
        }}>
          Limpar Logs
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {automations.map((aut) => (
          <div key={aut.id} className="rounded-xl border border-border bg-card/60 p-4 space-y-3 flex flex-col justify-between shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 shrink-0">{aut.type}</Badge>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground shrink-0">Runs: <strong className="text-white">{aut.runs}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = automations.map(a => a.id === aut.id ? { ...a, active: !a.active } : a);
                      setAutomations(updated);
                      toast.success(`Automação "${aut.name}" ${!aut.active ? "ativada" : "pausada"}.`);
                    }}
                    className="focus:outline-none shrink-0"
                  >
                    {aut.active ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[9px] font-bold">Ativo</Badge>
                    ) : (
                      <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/30 text-[9px] font-bold">Pausado</Badge>
                    )}
                  </button>
                </div>
              </div>
              
              <h4 className="font-semibold text-xs text-white truncate">{aut.name}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{aut.description}</p>
            </div>
            
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <button
                onClick={() => {
                  const updated = automations.map(a => a.id === aut.id ? { ...a, active: !a.active } : a);
                  setAutomations(updated);
                  toast.success(`Gatilho de rede "${aut.name}" foi ${!aut.active ? "ativado" : "desativado"}.`);
                }}
                className="text-[11px] text-muted-foreground font-semibold hover:text-white transition-all"
              >
                Alternar
              </button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-[11px] text-primary hover:bg-primary/10 font-bold"
                onClick={() => {
                  const updated = automations.map(a => a.id === aut.id ? { ...a, runs: a.runs + 1 } : a);
                  setAutomations(updated);
                  toast.success(`Disparando webhook/mensagem para ${getCustomerLabel(customer)} com sucesso.`);
                }}
              >
                Forçar Gatilho
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
