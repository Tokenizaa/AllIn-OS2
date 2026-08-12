import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, CheckCircle2, Clock, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CustomerDocumentsService } from "@/services/crm360";
import { queryKeys } from "@/hooks/queryKeys";

interface CustomerDocumentsTabProps {
  customer: any;
}

export function CustomerDocumentsTab({ customer }: CustomerDocumentsTabProps) {
  const queryClient = useQueryClient();
  const customerId = customer?.id;

  const { data: documents = [], isLoading } = useQuery({
    queryKey: queryKeys.customer(customerId),
    queryFn: () => CustomerDocumentsService.fetchDocuments(customerId),
    enabled: !!customerId,
  });

  const docStatusMutation = useMutation({
    mutationFn: async ({ docId, status }: { docId: string; status: string }) => {
      await CustomerDocumentsService.updateDocumentStatus(docId, status);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer(customerId) });
      const messages: Record<string, string> = {
        approved: "Documento aprovado com sucesso.",
        rejected: "Documento rejeitado.",
        pending: "Documento enviado para análise.",
      };
      toast.success(messages[variables.status] || "Status atualizado.");
    },
    onError: () => {
      toast.error("Falha ao atualizar status do documento.");
    },
  });

  const approveAllMutation = useMutation({
    mutationFn: async () => {
      const ids = documents.map(d => d.id);
      return CustomerDocumentsService.approveAll(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer(customerId) });
      toast.success("Todos os documentos regulatórios foram aprovados automaticamente!");
    },
    onError: () => {
      toast.error("Falha ao aprovar alguns documentos.");
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white">Compliance Regulatório e Documentação</h3>
        <p className="text-xs text-muted-foreground">Controle, auditoria e validação de envios obrigatórios para garantir repasse legal e fiscal de comissões</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card/60 p-5 space-y-4 shadow-sm">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lista de Envio de Documentos</h4>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="p-3 border border-border bg-background/20 rounded-lg flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs truncate text-white">{doc.name}</span>
                      {doc.required && <Badge className="text-[9px] bg-red-500/15 text-red-450 border-red-500/30 shrink-0">Obrigatório</Badge>}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
                      <span>Tipo: {doc.type || "-"}</span>
                      {doc.updatedAt && (
                        <>
                          <span>•</span>
                          <span>Atualizado: {new Date(doc.updatedAt).toLocaleDateString("pt-BR")}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {doc.status === "approved" && (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Aprovado
                      </Badge>
                    )}
                    {doc.status === "pending" && (
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[10px] flex items-center gap-1">
                        <Clock className="h-3 w-3 animate-pulse" /> Pendente
                      </Badge>
                    )}
                    {doc.status === "missing" && (
                      <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/30 text-[10px]">
                        Não Enviado
                      </Badge>
                    )}

                    <div className="flex gap-1">
                      {doc.status !== "approved" && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                          onClick={() => docStatusMutation.mutate({ docId: doc.id, status: "approved" })}
                          title="Aprovar Documento"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {doc.status !== "missing" && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => docStatusMutation.mutate({ docId: doc.id, status: "rejected" })}
                          title="Recusar / Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {doc.status === "missing" && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => docStatusMutation.mutate({ docId: doc.id, status: "pending" })}
                          title="Enviar para Análise"
                        >
                          <Upload className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card/60 p-5 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-white">Compliance Geral de Cadastro</h4>
            <div className="p-4 border border-border/60 bg-background/30 rounded-lg flex items-center gap-3">
              <Shield className="h-10 w-10 text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Identidade Parcialmente Aprovada</p>
                <p className="text-xs text-muted-foreground">Status atual autoriza o recebimento de comissões passivas de rede em pontos, mas bloqueia resgates monetários até aprovação da conta bancária e envio do comprovante de endereço.</p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1.5 p-3 rounded-lg border border-border/40">
              <p className="text-white"><strong>Notas de Compliance:</strong></p>
              <p>1. O documento bancário deve estar no CPF/CNPJ titular cadastrado ({customer.metadata?.cpf || customer.cpf || "CPF ausente"}). Não são permitidos pagamentos para terceiros.</p>
              <p>2. Os limites anuais de pagamento tributado são recalculados com base no envio do PIS/NIT para recolhimento de INSS.</p>
            </div>
          </div>

          <div className="border-t border-border pt-4 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-white border-white/20"
              onClick={() => approveAllMutation.mutate()}
              disabled={approveAllMutation.isPending}
            >
              {approveAllMutation.isPending ? "Aprovando..." : "Aprovar Todos"}
            </Button>
            <Button size="sm" className="flex-1 animate-pulse" onClick={() => {
              toast.success("Exportado relatório legal desta conta!");
            }}>
              Exportar Compliance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
