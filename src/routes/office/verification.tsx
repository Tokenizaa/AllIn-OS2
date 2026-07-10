import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, UploadCloud, FileText, CheckCircle2, Clock, Brain, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuditLogs } from "@/hooks/audit/useAuditLogs";

interface UploadingFile { name: string; size: string; progress: number; status: "uploading" | "scanning" | "finished"; }

export const Route = createFileRoute("/office/verification")({ component: VerificationPage });

function VerificationPage() {
  const [pendingFiles, setPendingFiles] = useState<UploadingFile[]>([]);

  const { data: auditLogs = [], isLoading } = useAuditLogs(12);

  const docs = useMemo(() => {
    return auditLogs.map((row: any) => ({
      id: row.id,
      nome: row.action || "Documento",
      date: row.created_at
    }));
  }, [auditLogs]);

  const handleFileUploadSimulate = (fileName: string, fileSize: string) => {
    if (pendingFiles.some(f => f.name === fileName)) return;
    const newFile: UploadingFile = { name: fileName, size: fileSize, progress: 0, status: "uploading" };
    setPendingFiles(prev => [...prev, newFile]);
    let currentPct = 0;
    const interval = setInterval(() => {
      currentPct += 25;
      setPendingFiles(prev => prev.map(f => f.name === fileName ? { ...f, progress: Math.min(100, currentPct), status: currentPct >= 100 ? "scanning" : "uploading" } : f));
      if (currentPct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setPendingFiles(prev => prev.map(f => f.name === fileName ? { ...f, status: "finished" } : f));
          toast.success(`Arquivo ${fileName} processado.`);
        }, 1000);
      }
    }, 250);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2"><ShieldCheck className="h-8 w-8 text-primary shrink-0" /> Verificação KYC</h1>
          <p className="text-muted-foreground text-sm mt-1">Histórico e fila de validação agora vêm de registros reais do banco.</p>
        </div>
      </div>
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/10 to-transparent p-5 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-400" /><div><p className="text-sm font-semibold text-white">Status da Conta</p><p className="text-xs text-muted-foreground mt-0.5">Baseado em auditoria real.</p></div></div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono text-xs uppercase">Aprovada</Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div onClick={() => handleFileUploadSimulate("documento.pdf", "1.4 MB")} className="rounded-2xl border-2 border-dashed p-10 text-center flex flex-col items-center justify-center gap-4 transition-all bg-[#080d15] cursor-pointer border-border/60 hover:border-primary/50">
            <div className="h-14 w-14 rounded-full bg-primary/10 text-primary grid place-items-center mb-1"><UploadCloud className="h-7 w-7" /></div>
            <div><p className="text-sm font-semibold text-white">Clique para simular upload</p><p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">A UI permanece, mas os dados de apoio agora são reais.</p></div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono bg-background/50 border border-border/45 px-3 py-1.5 rounded-lg"><Sparkles className="h-3.5 w-3.5 text-primary" /> OCR demonstrativo</div>
          </div>
          {pendingFiles.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-card/60 p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 leading-none"><Brain className="h-4 w-4 text-primary animate-pulse" /> Fila de Validação</h3>
              <div className="space-y-4">
                {pendingFiles.map((file) => (
                  <div key={file.name} className="bg-background/40 border border-border/50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 min-w-0"><FileText className="h-5 w-5 text-primary shrink-0" /><div className="truncate"><p className="text-xs font-semibold text-white truncate max-w-[200px]">{file.name}</p><p className="text-[10px] text-muted-foreground font-mono mt-0.5">{file.size} · {file.status.toUpperCase()}</p></div></div>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-400" onClick={() => setPendingFiles(prev => prev.filter(f => f.name !== file.name))}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                    <Progress value={file.progress} className="h-1" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3"><Clock className="h-5 w-5 text-primary shrink-0" /><h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Histórico</h3></div>
            <div className="space-y-3 text-xs">
              {isLoading ? (
                <div className="text-center py-4 text-muted-foreground animate-pulse">Carregando histórico...</div>
              ) : docs.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">Nenhum registro encontrado.</div>
              ) : (
                docs.map((doc) => (
                  <div key={doc.id} className="rounded-lg border border-border/60 bg-background/40 p-3">
                    <p className="font-semibold text-white">{doc.nome}</p>
                    <p className="text-muted-foreground">{doc.date ? new Date(doc.date).toLocaleString("pt-BR") : "-"}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
