import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { User, Building, Shield, Camera, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useMyProfile } from "@/hooks/profiles/useMyProfile";

type ProfileRow = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  sponsor_id?: string | null;
  city?: string | null;
  state?: string | null;
  role?: string | null;
};

export const Route = createFileRoute("/distributor/profile")({ component: ProfilePage });

function ProfilePage() {
  const [isCopied, setIsCopied] = useState(false);

  const { data: profile = null, isLoading } = useMyProfile();

  const copySponsorLink = async () => {
    const value = profile?.sponsor_id || "";
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setIsCopied(true);
    toast.success("Link copiado para compartilhamento!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground animate-pulse text-sm">Carregando dados do perfil...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <User className="h-8 w-8 text-primary shrink-0" />
          Meus Dados
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Perfil carregado do Supabase.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 text-center flex flex-col items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary via-fuchsia-500 to-cyan-400 p-0.5 shadow-lg">
                <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xl font-bold text-white uppercase">
                  {(profile?.name || "U").split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] uppercase font-mono">
                <Camera className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-[150px] mx-auto">{profile?.name || "-"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">ID: {profile?.id || "-"}</p>
            </div>
            <div className="flex flex-col gap-1 w-full pt-1.5 border-t border-border/20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Papel:</span>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] px-1.5 py-0">{profile?.role || "-"}</Badge>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-blue-500/5 p-4 space-y-2.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider font-mono block">Link de Recrutador</span>
            <p className="text-[11px] text-muted-foreground leading-snug">Esse dado agora vem do perfil real.</p>
            <div className="flex gap-1.5 pt-1">
              <Input type="text" value={profile?.sponsor_id || ""} readOnly className="h-8 text-[10px] font-mono bg-background/50 flex-1 border-border/60" />
              <Button size="sm" variant="outline" className="h-8 w-8 p-0 shrink-0 border-border/60 hover:text-white" onClick={copySponsorLink}>
                {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="perfil" className="space-y-6">
            <TabsList className="bg-background border border-border/50 max-w-full flex justify-start items-center overflow-x-auto gap-1">
              <TabsTrigger value="perfil" className="gap-1.5 text-xs"><User className="h-3.5 w-3.5" /> Meu Perfil</TabsTrigger>
              <TabsTrigger value="financeiro" className="gap-1.5 text-xs"><Building className="h-3.5 w-3.5" /> Conta & PIX</TabsTrigger>
              <TabsTrigger value="seguranca" className="gap-1.5 text-xs"><Shield className="h-3.5 w-3.5" /> Segurança & Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="perfil" className="space-y-5 rounded-2xl border border-border/60 bg-card/40 p-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Dados Cadastrais Básicos</h3>
                <p className="text-xs text-muted-foreground">Os campos agora são preenchidos a partir de profiles.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nome Completo" value={profile?.name || "-"} />
                <Field label="Endereço de E-mail" value={profile?.email || "-"} />
                <Field label="Número de Telefone" value={profile?.phone || "-"} />
                <Field label="CPF Fiscal" value={profile?.cpf || "-"} />
              </div>
            </TabsContent>

            <TabsContent value="financeiro" className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <p className="text-sm text-muted-foreground">A carteira bancária foi removida daqui porque agora vive no backend.</p>
            </TabsContent>

            <TabsContent value="seguranca" className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <p className="text-sm text-muted-foreground">Logs e auditoria devem vir da tabela audit_log.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Input value={value} readOnly className="h-9 text-xs bg-muted/20 text-muted-foreground cursor-not-allowed" />
    </div>
  );
}
