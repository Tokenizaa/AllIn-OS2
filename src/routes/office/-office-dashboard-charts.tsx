import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ttStyle = { background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 };

export function OfficeDashboardCharts({
  salesSeries,
  bonusOrigin,
}: {
  salesSeries: { day: string; vendas: number; bonus: number }[];
  bonusOrigin: { name: string; value: number }[];
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 rounded-2xl border border-border/60 bg-card/60 p-5">
        <h3 className="text-sm font-semibold">Vendas & Bônus · últimos registros</h3>
        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(Number(v) / 1000).toFixed(1)}k`} />
              <Tooltip contentStyle={ttStyle} />
              <Area type="monotone" dataKey="vendas" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.2} strokeWidth={2} />
              <Area type="monotone" dataKey="bonus" stroke="var(--color-success)" fill="var(--color-success)" fillOpacity={0.12} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <h3 className="text-sm font-semibold">Origem dos bônus</h3>
        <div className="h-56 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={bonusOrigin} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                {bonusOrigin.map((_, i) => (
                  <Cell key={i} fill={`var(--color-chart-${(i % 5) + 1})`} />
                ))}
              </Pie>
              <Tooltip contentStyle={ttStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function TopProductsChart({ data }: { data: { name: string; qtd: number; receita: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 12 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={10} width={120} />
        <Tooltip contentStyle={ttStyle} />
        <Bar dataKey="qtd" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
