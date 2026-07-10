import { useState, useMemo, useEffect } from "react";
import { Timeline } from "@/components/widgets/timeline";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CustomerNotesService } from "@/services/crm360/customer-notes";

interface CustomerTimelineTabProps {
  customer: any;
  orders: any[];
}

export function CustomerTimelineTab({ customer, orders }: CustomerTimelineTabProps) {
  const [customNotes, setCustomNotes] = useState<any[]>([]);
  const [noteText, setNoteText] = useState("");
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  // Carregar notas do banco ao montar o componente
  useEffect(() => {
    const loadNotes = async () => {
      if (!customer?.id && !customer?.id_comprador) return;
      
      setIsLoadingNotes(true);
      try {
        const notes = await CustomerNotesService.fetchCustomerNotes(
          customer?.id,
          customer?.id_comprador
        );
        setCustomNotes(notes);
      } catch (error) {
        console.error("Error loading notes:", error);
      } finally {
        setIsLoadingNotes(false);
      }
    };

    loadNotes();
  }, [customer?.id, customer?.id_comprador]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    
    try {
      const newNote = await CustomerNotesService.createNote({
        customer_id: customer?.id,
        id_comprador: customer?.id_comprador,
        note: noteText,
        note_type: "general",
        created_by: customer?.user_id || "system",
        is_private: false,
        metadata: {}
      });
      
      setCustomNotes([newNote, ...customNotes]);
      setNoteText("");
      toast.success("Nota salva com sucesso na linha do tempo!");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Erro ao salvar nota");
    }
  };

  const tl = useMemo(() => {
    return [
      ...customNotes.map((note) => ({
        id: note.id,
        type: "note" as const,
        title: note.note_type === 'general' ? 'Observação CRM' : `Nota: ${note.note_type}`,
        description: note.note,
        at: note.created_at,
      })),
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
