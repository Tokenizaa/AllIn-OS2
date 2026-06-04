import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Network, Users, TrendingUp, Sparkles, UserPlus, GitMerge, Search, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerService } from "@/services/customers";
import { getCustomerLabel } from "@/lib/customer-label";

type NodeRow = {
  id: string;
  usuario?: string | null;
  id_comprador?: string | null;
  user_id?: string | null;
  qualification?: string | null;
  status?: string | null;
  cidade?: string | null;
  estado?: string | null;
  name?: string | null;
};

export const Route = createFileRoute("/office/network")({ component: NetworkPage });

function NetworkPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "leader" | "critical">("all");

  const { data: nodes = [], isLoading } = useQuery<NodeRow[]>({
    queryKey: ["office-network-nodes"],
    queryFn: () => CustomerService.fetchNetworkMembers(500) as Promise<NodeRow[]>,
  });

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return nodes.filter((node) => {
      const hay = [getCustomerLabel(node), node.qualification, node.cidade, node.estado].filter(Boolean).join(" ").toLowerCase();
      if (q && !hay.includes(q)) return false;
      if (activeFilter === "active") return node.status !== "inactive";
      if (activeFilter === "leader") return String(node.qualification || "").toLowerCase().includes("ouro") || String(node.qualification || "").toLowerCase().includes("diamante");
      if (activeFilter === "critical") return node.status === "inactive";
      return true;
    });
  }, [nodes, searchQuery, activeFilter]);

  const total = nodes.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Network className="h-8 w-8 text-primary shrink-0" /> Minha Rede
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Base real: customers + network_relationships.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-border/60">
            <GitMerge className="h-4 w-4" /> Exportar
          </Button>
          <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500">
            <UserPlus className="h-4 w-4" /> Cadastrar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Rede total" value={String(total)} icon={<Users className="h-4 w-4 text-emerald-400" />} />
        <Card label="Ativos" value={String(nodes.filter((n) => n.status !== "inactive").length)} icon={<TrendingUp className="h-4 w-4 text-fuchsia-400" />} />
        <Card label="Qualificados" value={String(nodes.filter((n) => String(n.qualification || "").length > 0).length)} icon={<Sparkles className="h-4 w-4 text-amber-400" />} />
        <Card label="Inativos" value={String(nodes.filter((n) => n.status === "inactive").length)} icon={<Sparkles className="h-4 w-4 text-rose-400" />} />
      </div>

      <Tabs defaultValue="linear" className="space-y-6">
        <TabsList className="bg-background border border-border/50">
          <TabsTrigger value="linear" className="gap-2">
            <Users className="h-4 w-4" /> Rede Linear
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" /> Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="linear" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar distribuidor..." className="pl-9 h-9" />
            </div>
            <Button variant={activeFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setActiveFilter("all")}>Todos</Button>
            <Button variant={activeFilter === "active" ? "default" : "outline"} size="sm" onClick={() => setActiveFilter("active")}>Ativos</Button>
            <Button variant={activeFilter === "leader" ? "default" : "outline"} size="sm" onClick={() => setActiveFilter("leader")}>Líderes</Button>
            <Button variant={activeFilter === "critical" ? "default" : "outline"} size="sm" onClick={() => setActiveFilter("critical")}>Risco</Button>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-1 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-black/20">
                    <th className="px-5 py-4">Distribuidor</th>
                    <th className="px-5 py-4">Qualificação</th>
                    <th className="px-5 py-4">Cidade</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground animate-pulse">
                        Carregando membros da rede...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                        Nenhum membro da rede encontrado.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((node) => (
                      <tr key={node.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-5 py-4 font-semibold text-white">{getCustomerLabel(node)}</td>
                        <td className="px-5 py-4">
                          <Badge variant="outline">{node.qualification || "-"}</Badge>
                        </td>
                        <td className="px-5 py-4">{[node.cidade, node.estado].filter(Boolean).join("/") || "-"}</td>
                        <td className="px-5 py-4">{node.status || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <p className="text-sm text-muted-foreground">Analytics simplificado baseado em registros reais.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Card({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
