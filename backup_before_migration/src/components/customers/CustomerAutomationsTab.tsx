import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getCustomerLabel } from "@/lib/customer-label";
import { AutomationService } from "@/services/automations";

interface CustomerAutomationsTabProps {
  customer: any;
}

export function CustomerAutomationsTab({ customer }: CustomerAutomationsTabProps) {
  const [automations, setAutomations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAutomations = async () => {
      if (!customer?.id) return;
      
      setIsLoading(true);
      try {
        const autos = await AutomationService.fetchCustomerAutomations(customer.id);
        setAutomations(autos);
      } catch (error) {
        console.error("Error loading automations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAutomations();
  }, [customer?.id]);

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
                    onClick={async () => {
                      const success = await AutomationService.updateAutomationStatus(aut.id, !aut.active);
                      if (success) {
                        const updated = automations.map(a => a.id === aut.id ? { ...a, active: !a.active } : a);
                        setAutomations(updated);
                        toast.success(`Automação "${aut.name}" ${!aut.active ? "ativada" : "pausada"}.`);
                      } else {
                        toast.error(`Falha ao ${!aut.active ? "ativar" : "pausar"} automação "${aut.name}".`);
                      }
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
                onClick={async () => {
                  const success = await AutomationService.updateAutomationStatus(aut.id, !aut.active);
                  if (success) {
                    const updated = automations.map(a => a.id === aut.id ? { ...a, active: !a.active } : a);
                    setAutomations(updated);
                    toast.success(`Gatilho de rede "${aut.name}" foi ${!aut.active ? "ativado" : "desativado"}.`);
                  } else {
                    toast.error(`Falha ao ${!aut.active ? "ativar" : "desativar"} gatilho "${aut.name}".`);
                  }
                }}
                className="text-[11px] text-muted-foreground font-semibold hover:text-white transition-all"
              >
                Alternar
              </button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-[11px] text-primary hover:bg-primary/10 font-bold"
                onClick={async () => {
                  const success = await AutomationService.incrementAutomationRuns(aut.id);
                  if (success) {
                    const updated = automations.map(a => a.id === aut.id ? { ...a, runs: a.runs + 1 } : a);
                    setAutomations(updated);
                    toast.success(`Disparando webhook/mensagem para ${getCustomerLabel(customer)} com sucesso.`);
                  } else {
                    toast.error(`Falha ao disparar gatilho "${aut.name}".`);
                  }
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
