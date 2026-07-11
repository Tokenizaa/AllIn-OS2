import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/widgets/page-header";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FeatureFlagService } from "@/services/system/feature-flags";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

const FEATURE_FLAG_DEFS = [
  { id: "ai_copilot", label: "Copiloto IA habilitado", desc: "Ativa o painel de assistência inteligente em toda a plataforma." },
  { id: "anomaly_engine", label: "Motor de anomalias", desc: "Detecção automática de outliers em transações e operações." },
  { id: "auto_workflows", label: "Workflows automáticos", desc: "Permite que a IA dispare automações baseadas em sinais." },
  { id: "realtime", label: "Realtime everywhere", desc: "Eventos em tempo real para todas as entidades operacionais." },
];

const FLAG_IDS = FEATURE_FLAG_DEFS.map(f => f.id);

function useFeatureFlags() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["feature-flags"],
    queryFn: async () => {
      const flags = await FeatureFlagService.getAllFlags();
      const result: Record<string, boolean> = {};
      for (const id of FLAG_IDS) {
        result[id] = flags[id] ?? false;
      }
      return result;
    },
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const success = await FeatureFlagService.setFlag(id, enabled);
      if (!success) throw new Error("Falha ao atualizar flag");
    },
    onMutate: async ({ id, enabled }) => {
      await queryClient.cancelQueries({ queryKey: ["feature-flags"] });
      const previous = queryClient.getQueryData<Record<string, boolean>>(["feature-flags"]);
      queryClient.setQueryData<Record<string, boolean>>(["feature-flags"], (old) => ({ ...old, [id]: enabled }));
      return { previous };
    },
    onError: (_err, { id }, context) => {
      if (context?.previous) queryClient.setQueryData(["feature-flags"], context.previous);
      toast.error("Erro ao atualizar flag. Revertido.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
    },
  });

  return { flags: query.data ?? {}, isLoading: query.isLoading, toggleFlag: (id: string) => mutation.mutate({ id, enabled: !query.data?.[id] }), getFlagValue: (id: string) => query.data?.[id] ?? false };
}

function SettingsPage() {
  const { flags: _flags, isLoading, toggleFlag, getFlagValue } = useFeatureFlags();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Sistema" title="Configurações" subtitle="Feature flags, tenant, integrações e preferências da plataforma." />
      <div className="rounded-xl border border-border bg-card/60 p-5 space-y-4">
        <h3 className="text-sm font-semibold">Feature flags</h3>
        {isLoading ? (
          <div className="space-y-4">
            {FEATURE_FLAG_DEFS.map((f) => (
              <div key={f.id} className="flex items-start justify-between gap-4 py-2 border-t border-border/60 first:border-t-0">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-6 w-10 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          FEATURE_FLAG_DEFS.map((f) => (
            <div key={f.id} className="flex items-start justify-between gap-4 py-2 border-t border-border/60 first:border-t-0">
              <div>
                <Label htmlFor={f.id} className="text-sm">{f.label}</Label>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
              <Switch id={f.id} checked={getFlagValue(f.id)} onCheckedChange={() => toggleFlag(f.id)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
