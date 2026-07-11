import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportsChartsProps {
  points: Array<{ month: string; vendas: number; comissoes: number; retencao: number; conversao: number }>;
}

export default function ReportsCharts({ points }: ReportsChartsProps) {
  const [timeframe, setTimeframe] = useState("30");
  const [selectedMetric, setSelectedMetric] = useState<"vendas" | "comissoes" | "retencao">("vendas");

  return (
    <div className="rounded-3xl border border-border/60 bg-card/40 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Curva Analítica de Desenvolvimento
          </h2>
          <p className="text-xs text-muted-foreground">Agregação mensal dos pagamentos.</p>
        </div>
        <div className="flex bg-background/80 p-0.5 rounded-lg border border-border/60 self-start">
          {["30", "90", "365"].map((value) => (
            <Button key={value} variant={timeframe === value ? "secondary" : "ghost"} size="sm" onClick={() => setTimeframe(value)} className="h-7 text-[11px] px-2.5">
              {value === "30" ? "Últimos 30 dias" : value === "90" ? "Trimestre" : "Anual"}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-80 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          {selectedMetric === "vendas" ? (
            <AreaChart data={points}>
              <defs>
                <linearGradient id="vendasGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="vendas" name="Vendas Ativas (R$)" stroke="var(--color-primary)" strokeWidth={3} fill="url(#vendasGrad)" />
            </AreaChart>
          ) : selectedMetric === "comissoes" ? (
            <BarChart data={points}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="comissoes" name="Bônus Unilevel (R$)" fill="var(--color-success)" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={points}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} domain={[90, 100]} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="retencao" name="Frequência Consistência (%)" stroke="#818cf8" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="conversao" name="Conversão Loja (%)" stroke="#f43f5e" strokeWidth={2} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
