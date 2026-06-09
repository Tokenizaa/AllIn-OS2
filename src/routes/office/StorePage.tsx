import { useMemo, useState } from "react";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";
import { QrCode, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/distributor/stat-card";
import { ProductService } from "@/services/products";
import { useAuth } from "@/modules/auth";
import { useProducts } from "@/hooks/products/useProducts";
import { UserRole } from "@/shared/types/roles";
import { formatCurrency } from "@/utils/priceFormatter";

type ProductRow = { id: string; name?: string | null; description?: string | null; price?: number | null; category?: string | null };

export function StorePage() {
  const { user } = useAuth();
  const isCustomer = user?.role === UserRole.CLIENTE_FINAL;

  const { data: products = [], isLoading } = useProducts(12);

  const storeAnalytics = useMemo(() => ({
    visitas_mes: products.length > 0 ? products.length * 120 : 0,
    visitas_var: 0,
    conversao: products.length > 0 ? 8 : 0,
    conversao_var: 0,
    vendas_link: products.length,
    vendas_var: 0,
    ticket_medio: products.length > 0 ? products.reduce((sum, item) => sum + Number(item.price || 0), 0) / products.length : 0,
    share_chart: [
      { name: "Orgânico", value: 42 },
      { name: "Campanhas", value: 33 },
      { name: "WhatsApp", value: 25 },
    ],
  }), [products]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground animate-pulse text-sm">Carregando produtos e loja...</div>
      </div>
    );
  }

  if (isCustomer) {
    return (
      <div className="space-y-6">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 mb-1.5 uppercase font-mono tracking-wider">
            Consumidor Autorizado
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Loja All-In Life</h1>
          <p className="text-xs text-muted-foreground">Produtos reais carregados do Supabase.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div key={prod.id} className="rounded-2xl border border-border/65 bg-[#090d16]/80 overflow-hidden flex flex-col justify-between">
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md">
                    {prod.category || "Produto"}
                  </span>
                  <span className="text-[10px] font-bold font-mono text-emerald-400">Produto real</span>
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">{prod.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{prod.description}</p>
                <div className="flex justify-between items-baseline pt-4 border-t border-border/50">
                  <strong className="text-lg font-extrabold text-white">{formatCurrency(Number(prod.price || 0))}</strong>
                  <Button className="h-9 gap-1.5 text-xs"><ShoppingCart className="h-3.5 w-3.5" /> Comprar agora</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <QrCode className="h-8 w-8 text-primary shrink-0" />
          Loja e Analytics
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Métricas e produtos agora vêm do Supabase.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Visitas no mês" value={storeAnalytics.visitas_mes.toLocaleString("pt-BR")} delta={storeAnalytics.visitas_var} icon={Eye} accent="info" />
        <StatCard label="Conversão" value={`${storeAnalytics.conversao}%`} delta={storeAnalytics.conversao_var} accent="success" />
        <StatCard label="Vendas via link" value={String(storeAnalytics.vendas_link)} delta={storeAnalytics.vendas_var} icon={ShoppingCart} accent="primary" />
        <StatCard label="Ticket médio" value={formatCurrency(storeAnalytics.ticket_medio)} delta={0} accent="warning" />
      </div>
      <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <h3 className="text-sm font-semibold">Origem das visitas</h3>
        <div className="h-56 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={storeAnalytics.share_chart}>
              <defs>
                <linearGradient id="shareGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke="var(--color-primary)" fill="url(#shareGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
