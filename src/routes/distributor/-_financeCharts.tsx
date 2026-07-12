import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface FinanceChartsProps {
  totalMonth: number;
}

export default function FinanceCharts({ totalMonth }: FinanceChartsProps) {
  const earnings = useMemo(() => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return months.map((mes, i) => ({
      mes,
      valor: Math.max(0, Number(totalMonth || 0) * (0.3 + (i / 20))),
    }));
  }, [totalMonth]);

  const bonusOrigin = useMemo(() => [
    { name: "Saques", value: 38 },
    { name: "Comissões", value: 34 },
    { name: "Bônus", value: 28 },
  ], []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 rounded-2xl border border-border/60 bg-card/60 p-5">
        <h3 className="text-sm font-semibold">Ganhos por mês</h3>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={earnings}>
              <defs>
                <linearGradient id="ge" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="valor" stroke="var(--color-success)" fill="url(#ge)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <h3 className="text-sm font-semibold">Origem dos ganhos</h3>
        <div className="h-56 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={bonusOrigin} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                {bonusOrigin.map((_, i) => <Cell key={i} fill={`var(--color-chart-${(i % 5) + 1})`} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
