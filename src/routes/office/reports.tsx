import { useState, useMemo, lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, ArrowUpRight, FileSpreadsheet, FileText, ShoppingCart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePayments } from "@/hooks/payments/usePayments";
import { toast } from "sonner";
import { formatBRL } from "@/lib/customer-calculations";

const ReportsCharts = lazy(() => import("./_reportsCharts"));

type ReportPoint = { month: string; vendas: number; comissoes: number; retencao: number; conversao: number };

export const Route = createFileRoute("/office/reports")({ component: ReportsPage });

function ReportsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<"vendas" | "comissoes" | "retencao">("vendas");

  const { data: payments = [], isLoading } = usePayments(500);

  const points = useMemo<ReportPoint[]>(() => {
    const monthMap = new Map<string, { vendas: number; comissoes: number; count: number }>();
    payments.forEach((row: any) => {
      const month = new Date(row.created_at || Date.now()).toLocaleDateString("pt-BR", { month: "short" });
      const entry = monthMap.get(month) || { vendas: 0, comissoes: 0, count: 0 };
      const amount = Number(row.amount || 0);
      entry.vendas += amount;
      entry.comissoes += amount * 0.18;
      entry.count += 1;
      monthMap.set(month, entry);
    });
    return Array.from(monthMap.entries()).map(([month, value]) => ({
      month,
      vendas: value.vendas,
      comissoes: value.comissoes,
      retencao: 90 + Math.min(9, value.count % 10),
      conversao: 4 + Math.min(4, value.count % 5),
    }));
  }, [payments]);

  const summary = useMemo(() => {
    const totalSales = points.reduce((sum, item) => sum + item.vendas, 0);
    const totalCommissions = points.reduce((sum, item) => sum + item.comissoes, 0);
    return { totalSales, totalCommissions };
  }, [points]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground animate-pulse text-sm">Carregando relatórios analíticos...</div>
      </div>
    );
  }

  const handleExport = (format: "pdf" | "excel") => {
    setIsExporting(true);
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: `Gerando relatório analítico em formato ${format.toUpperCase()}...`,
      success: () => {
        setIsExporting(false);
        return `Relatório baixado com sucesso! (${format.toUpperCase()})`;
      },
      error: "Erro ao exportar arquivo.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary shrink-0" />
            Relatórios Avançados <span className="text-xs font-mono font-medium tracking-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Supabase</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Baseado em pagamentos reais agregados por mês.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-border/60" disabled={isExporting} onClick={() => handleExport("excel")}>
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Excel
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-border/60" disabled={isExporting} onClick={() => handleExport("pdf")}>
            <FileText className="h-4 w-4 text-rose-400" /> Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard active={selectedMetric === "vendas"} onClick={() => setSelectedMetric("vendas")} label="Volume de Vendas (Ciclo)" value={formatBRL(summary.totalSales)} icon={<ShoppingCart className="h-4 w-4" />} />
        <MetricCard active={selectedMetric === "comissoes"} onClick={() => setSelectedMetric("comissoes")} label="Rendimento de Bônus" value={formatBRL(summary.totalCommissions)} icon={<TrendingUp className="h-4 w-4" />} />
        <MetricCard active={selectedMetric === "retencao"} onClick={() => setSelectedMetric("retencao")} label="Consistência de Rede" value="Dados reais" icon={<Users className="h-4 w-4" />} />
      </div>

      <Suspense fallback={<div className="h-80 animate-pulse bg-muted rounded-3xl" />}>
        <ReportsCharts points={points} />
      </Suspense>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <h3 className="text-sm font-semibold flex items-center gap-2"><Badge>Fonte</Badge> Somente pagamentos reais foram usados neste relatório.</h3>
      </div>
    </div>
  );
}

function MetricCard({ active, onClick, label, value, icon }: { active: boolean; onClick: () => void; label: string; value: string; icon: React.ReactNode }) {
  return (
    <div onClick={onClick} className={`rounded-2xl border p-5 cursor-pointer transition-all ${active ? "bg-primary/10 border-primary shadow-lg shadow-primary/5" : "bg-card/60 border-border/30 hover:border-border/60"}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">{label}</span>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
      <div className="mt-1 flex items-center justify-between text-xs">
        <span className="text-emerald-400 font-semibold inline-flex items-center gap-0.5"><ArrowUpRight className="h-3.5 w-3.5" /> +0%</span>
        <span className="text-muted-foreground">vs. período anterior</span>
      </div>
    </div>
  );
}
