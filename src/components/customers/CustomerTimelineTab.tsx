import { useState, useMemo } from "react";
import { Timeline } from "@/components/widgets/timeline";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CustomerTimelineTabProps {
  customer: any;
  orders: any[];
}

export function CustomerTimelineTab({ customer, orders }: CustomerTimelineTabProps) {
  const [customNotes, setCustomNotes] = useState<any[]>([]);
  const [noteText, setNoteText] = useState("");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    const newNote = {
      id: "note-" + Date.now().toString(),
      type: "note" as const,
      title: "Observação CRM",
      description: noteText,
      at: new Date().toISOString()
    };
    setCustomNotes([newNote, ...customNotes]);
    setNoteText("");
    toast.success("Nota salva com sucesso na linha do tempo!");
  };

  const tl = useMemo(() => {
    return [
      ...customNotes,
      { id: "1", type: "note" as const, title: "Ficha Operacional", description: "Distribuidor sincronizado com os dados do Supabase.", at: customer?.created_at || new Date().toISOString() },
      ...orders.slice(0, 4).map((o, index) => ({
        id: `order-tl-${index}`,
        type: "order" as const,
        title: `Pedido ${o.numero_pedido || o.id.slice(0, 8)}`,
        description: `Status de processamento: ${o.status_pedido || o.status || "Pendente"}`,
        at: o.created_at || new Date().toISOString(),
      })),
    ];
  }, [customNotes, orders, customer?.created_at]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-xl border border-border bg-card/60 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">Linha do Tempo e Histórico do Distribuidor</h3>
        <Timeline events={tl as any} />
      </div>

      <div className="lg:col-span-1 rounded-xl border border-border bg-card/60 p-5 h-fit space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold text-white">Registrar Anotação de CRM</h3>
        <form onSubmit={handleAddNote} className="space-y-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Insira notas de contato, pendências de suporte, acordos de rede..."
            className="w-full h-24 bg-background border border-border rounded-lg p-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <Button type="submit" size="sm" className="w-full">
            Salvar Histórico
          </Button>
        </form>
      </div>
    </div>
  );
}
