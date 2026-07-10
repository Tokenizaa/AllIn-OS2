import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/widgets/page-header";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { productsService } from "@/services/products";

export const Route = createFileRoute("/_app/products/")({ component: ProductsPage });

function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setProducts(await productsService.getAllProducts());
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Comercial" title="Catálogo de produtos" subtitle="Dados reais vindos do Supabase." />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {products.map((p) => {
          const low = Number(p.stock || 0) < 200;
          const out = Number(p.stock || 0) === 0;
          return (
            <div key={p.id} className="rounded-xl border border-border bg-card/60 p-4 hover:bg-card transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{p.categorias || p.category || "-"} · {p.sku || "-"}</p>
                  <h3 className="text-base font-semibold mt-0.5">{p.caption || p.name}</h3>
                </div>
                <Badge variant="outline" className="capitalize text-[10px]">{out ? "sem estoque" : "ativo"}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{p.caption2 || p.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md border border-border bg-background/40 p-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Preço</p>
                  <p className="text-sm font-semibold tabular-nums">R$ {Number(p.price || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="rounded-md border border-border bg-background/40 p-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Bônus</p>
                  <p className="text-sm font-semibold text-primary">{p.metadata?.bonus_payment_percentage || p.bonus_payment_percentage || 0}%</p>
                </div>
                <div className={`rounded-md border p-2 ${out ? "border-destructive/40 bg-destructive/10" : low ? "border-warning/40 bg-warning/10" : "border-border bg-background/40"}`}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Estoque</p>
                  <p className={`text-sm font-semibold tabular-nums ${out ? "text-destructive" : low ? "text-warning" : ""}`}>{p.stock || 0}</p>
                </div>
              </div>
              {out && (
                <p className="mt-3 inline-flex items-center gap-1 text-xs text-destructive"><AlertTriangle className="h-3 w-3" /> Sem estoque</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
