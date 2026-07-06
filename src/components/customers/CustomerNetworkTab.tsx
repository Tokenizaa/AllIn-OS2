import { Link } from "@tanstack/react-router";
import { Users, ArrowUpRight, TrendingUp, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/widgets/kpi-card";
import { formatBRL } from "@/lib/customer-calculations";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  inactive: "bg-red-500/10 text-red-500/30 border-red-500/30",
  churned: "bg-muted text-muted-foreground border-border",
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

interface CustomerNetworkTabProps {
  customer: any;
  downlines: any[];
  networkMetrics?: any;
}

export function CustomerNetworkTab({ customer, downlines, networkMetrics }: CustomerNetworkTabProps) {
  const directIndications = networkMetrics?.direct_indications || downlines.length;
  const totalNetworkSize = networkMetrics?.total_network_size || 0;
  const estimatedBonus = networkMetrics?.estimated_bonus || 0;
  const networkLevel = networkMetrics?.network_level || 0;

  return (
    <div className="space-y-4">
      {/* Network Metrics KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard 
          label="Indicações Diretas" 
          value={String(directIndications)} 
          icon={<Users className="h-4 w-4" />}
        />
        <KpiCard 
          label="Rede Total" 
          value={String(totalNetworkSize)} 
          icon={<Network className="h-4 w-4" />}
        />
        <KpiCard 
          label="Bônus Estimado" 
          value={formatBRL(estimatedBonus)} 
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KpiCard 
          label="Nível de Rede" 
          value={String(networkLevel)} 
        />
      </div>

      {/* Downlines Table */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Parceiros da Rede (Indicações Diretas)</h3>
          <p className="text-xs text-muted-foreground">Listagem em tempo real de distribuidores cujo sponsor direta é @{customer.id_comprador || customer.usuario}</p>
        </div>
        <Badge variant="outline" className="px-2.5 py-1 text-xs text-white border-white/20">
          {downlines.length} Diretos Cadastrados
        </Badge>
      </div>
      
      <div className="rounded-xl border border-border bg-card/45 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 text-left">Distribuidor</th>
              <th className="px-4 py-2.5 text-left">Código / ID com.</th>
              <th className="px-4 py-2.5 text-left">Graduação</th>
              <th className="px-4 py-2.5 text-left">Status de Conta</th>
              <th className="px-4 py-2.5 text-left">Cidade/UF</th>
              <th className="px-4 py-2.5 text-left">Data Cadastro</th>
              <th className="px-4 py-2.5 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-white/90">
            {downlines.map((dl) => (
              <tr key={dl.id} className="hover:bg-accent/30 transition-all">
                <td className="px-4 py-3 font-semibold text-white">
                  {dl.usuario || "Distribuidor S/N"}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {dl.id_comprador || dl.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-[10px]">
                    {dl.qualification || "Afiliado"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex rounded-md border px-1.5 py-0.5 text-[10px] capitalize font-medium", statusStyles[dl.status || "pending"])}>
                    {dl.status || "pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {dl.cidade && dl.estado ? `${dl.cidade}/${dl.estado}` : "-"}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {dl.created_at ? new Date(dl.created_at).toLocaleDateString("pt-BR") : "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link to="/_app/customers/$id" params={{ id: dl.id }} className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-0.5">
                    Ver 360 <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
            {downlines.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <Users className="h-8 w-8 text-muted-foreground/60" />
                    <p className="font-semibold text-foreground">Sem indicações diretas</p>
                    <span className="text-xs text-muted-foreground">Esse distribuidor ainda não possui indicados ou downlines posicionados em sua rede de bônus.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
