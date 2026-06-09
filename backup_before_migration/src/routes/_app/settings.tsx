import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/widgets/page-header";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FeatureFlagService } from "@/services/featureFlags";

export const Route = createFileRoute("/_app/settings")({ component: SettingsPage });

// Definição das feature flags
const FEATURE_FLAGS = [
  { id: "ai_copilot", label: "Copiloto IA habilitado", desc: "Ativa o painel de assistência inteligente em toda a plataforma.", defaultValue: false },
  { id: "anomaly_engine", label: "Motor de anomalias", desc: "Detecção automática de outliers em transações e operações.", defaultValue: false },
  { id: "auto_workflows", label: "Workflows automáticos", desc: "Permite que a IA dispare automações baseadas em sinais.", defaultValue: false },
  { id: "realtime", label: "Realtime everywhere", desc: "Eventos em tempo real para todas as entidades operacionais.", defaultValue: false },
];

// Hook para gerenciar feature flags com persistência em banco e cache em localStorage
function useFeatureFlags() {
  const [flags, setFlags] = useState<Record<string, boolean>>(() => {
    // Carregar flags do localStorage como cache inicial
    const saved = localStorage.getItem("feature_flags");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });
  const [isLoading, setIsLoading] = useState(true);

  // Carregar flags do banco ao montar o componente
  useEffect(() => {
    const loadFlagsFromDatabase = async () => {
      try {
        const dbFlags = await FeatureFlagService.getAllFlags();
        if (Object.keys(dbFlags).length > 0) {
          setFlags(dbFlags);
          // Atualizar cache local
          localStorage.setItem("feature_flags", JSON.stringify(dbFlags));
        }
      } catch (error) {
        console.error("Error loading flags from database:", error);
        // Fallback para localStorage se o banco falhar
      } finally {
        setIsLoading(false);
      }
    };

    loadFlagsFromDatabase();
  }, []);

  // Salvar flags no localStorage como cache quando mudarem
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("feature_flags", JSON.stringify(flags));
    }
  }, [flags, isLoading]);

  const toggleFlag = async (id: string) => {
    const newValue = !flags[id];
    
    // Atualizar estado local imediatamente para responsividade
    setFlags((prev) => ({ ...prev, [id]: newValue }));

    // Sincronizar com banco
    try {
      const success = await FeatureFlagService.setFlag(id, newValue);
      if (!success) {
        // Reverter mudança se falhar
        setFlags((prev) => ({ ...prev, [id]: !newValue }));
      }
    } catch (error) {
      console.error("Error updating flag in database:", error);
      // Reverter mudança se falhar
      setFlags((prev) => ({ ...prev, [id]: !newValue }));
    }
  };

  const getFlagValue = (id: string, defaultValue: boolean) => {
    return flags[id] !== undefined ? flags[id] : defaultValue;
  };

  return { flags, toggleFlag, getFlagValue, isLoading };
}

function SettingsPage() {
  const { flags, toggleFlag, getFlagValue } = useFeatureFlags();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Sistema" title="Configurações" subtitle="Feature flags, tenant, integrações e preferências da plataforma." />
      <div className="rounded-xl border border-border bg-card/60 p-5 space-y-4">
        <h3 className="text-sm font-semibold">Feature flags</h3>
        {FEATURE_FLAGS.map((f) => (
          <div key={f.id} className="flex items-start justify-between gap-4 py-2 border-t border-border/60 first:border-t-0">
            <div>
              <Label htmlFor={f.id} className="text-sm">{f.label}</Label>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
            <Switch
              id={f.id}
              checked={getFlagValue(f.id, f.defaultValue)}
              onCheckedChange={() => toggleFlag(f.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
