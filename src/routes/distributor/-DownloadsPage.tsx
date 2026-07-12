import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Search, Play, Clock, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

export function DownloadsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites] = useState<string[]>([]);
  const videoProgress = 65;

  const { data: items = [] } = useQuery({
    queryKey: ["office", "downloads"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .schema("crm")
        .from("downloads")
        .select("*")
        .order("created_at", { ascending: false }) as any);
      if (error) {
        console.warn("Downloads table not available:", error.message);
        return [];
      }
      return data || [];
    },
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  const filteredLibrary = items.filter((item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory || (activeCategory === "favorites" && favorites.includes(item.id));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2"><Download className="h-8 w-8 text-primary shrink-0" /> Biblioteca & Onboarding</h1>
          <p className="text-muted-foreground text-sm mt-1">A lista foi reduzida para itens neutros enquanto o catálogo real é conectado ao Supabase.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-[#06090f] p-5">
          <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5 font-mono"><Play className="h-3 w-3 fill-primary text-primary" /> Onboarding</span>
            <Badge variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-400 bg-emerald-500/5">Ativo</Badge>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs"><span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Progresso</span><span className="font-semibold text-white">{videoProgress}% completo</span></div>
            <Progress value={videoProgress} className="h-1.5" />
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3"><Sparkles className="h-5 w-5 text-primary shrink-0" /><h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Indicações</h3></div>
            <p className="text-xs text-muted-foreground leading-relaxed">A biblioteca de apoio será preenchida com conteúdo real em outra tabela ou storage.</p>
          </div>
          <div className="bg-primary/5 rounded-xl border border-primary/20 p-3 flex items-center gap-2 text-[10px] text-muted-foreground font-mono mt-4"><Info className="h-4 w-4 text-primary shrink-0" /><span>Downloads concluídos geram pontos de qualificação residual (PV).</span></div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Buscar treinamentos..." className="pl-9 h-9 text-xs" />
        </div>
        <div className="flex flex-wrap gap-1">
          {["all", "treinamento", "estratégia", "campanha", "favorites"].map((cat) => (
            <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(cat)} className="h-8 text-[11px] px-3 font-medium">
              {cat === "all" ? "Todos" : cat}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredLibrary.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border/60 bg-card/60 p-4 flex flex-col justify-between min-h-[160px]">
            <div><Badge variant="outline" className="text-[10px]">{item.category}</Badge><h3 className="mt-2 text-sm font-semibold text-white">{item.title}</h3></div>
            <Button size="sm" variant="outline" className="mt-4 w-full gap-2" onClick={() => toast.success("Download preparado em fluxo real.")}><Download className="h-3.5 w-3.5" /> Baixar</Button>
          </div>
        ))}
      </div>
    </div>
  );
}


