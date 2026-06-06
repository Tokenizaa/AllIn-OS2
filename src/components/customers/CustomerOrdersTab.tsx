import { formatBRL } from "@/lib/customer-calculations";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  inactive: "bg-red-500/10 text-red-500/30 border-red-500/30",
  churned: "bg-muted text-muted-foreground border-border",
};

interface CustomerOrdersTabProps {
  orders: any[];
}

export function CustomerOrdersTab({ orders }: CustomerOrdersTabProps) {
  return (
    <div className="rounded-xl border border-border bg-card/40 overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 text-left">Nº Pedido</th>
            <th className="px-4 py-2.5 text-left">Status</th>
            <th className="px-4 py-2.5 text-left">Método de pagamento</th>
            <th className="px-4 py-2.5 text-right">Valor do pedido</th>
            <th className="px-4 py-2.5 text-left">Data de emissão</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 text-white/90">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-accent/30 transition-all">
              <td className="px-4 py-3 font-mono text-xs">{o.numero_pedido || o.id.slice(0, 10)}</td>
              <td className="px-4 py-3">
                <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
                  {o.status_pedido || o.status || "pendente"}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground capitalize">
                {o.payment_method || "pix"} · {o.payment_status || "pago"}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-white font-medium">
                {formatBRL(Number(o.valor_total_pedido || o.valor_total || 0))}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {o.created_at ? new Date(o.created_at).toLocaleDateString("pt-BR") : "-"}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                Sem pedidos cadastrados para esse cliente.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
