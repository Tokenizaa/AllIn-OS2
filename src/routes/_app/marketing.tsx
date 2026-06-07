import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/widgets/page-header";
import { Megaphone, Link as LinkIcon, Mail, Image as ImageIcon, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/_app/marketing")({ component: MarketingPage });

function MarketingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState("");

  const handleCreateCampaign = () => {
    if (!campaignName || !campaignType) return;
    // Em uma implementação real, isso salvaria no banco de dados
    console.log("Criando campanha:", { name: campaignName, type: campaignType });
    setIsDialogOpen(false);
    setCampaignName("");
    setCampaignType("");
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Marketing" title="Campanhas & Comunicação" subtitle="Sistema de marketing em desenvolvimento." actions={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova campanha</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Campanha</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Nome da campanha</Label>
                <Input
                  id="campaign-name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Ex: Lançamento Q2 2026"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-type">Tipo</Label>
                <select
                  id="campaign-type"
                  value={campaignType}
                  onChange={(e) => setCampaignType(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="push">Push Notification</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateCampaign} disabled={!campaignName || !campaignType}>Criar campanha</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      } />
      <div className="rounded-xl border border-border bg-card/60 p-5">
        <h3 className="text-sm font-semibold mb-3">Status do sistema</h3>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="rounded-lg border border-border bg-background/40 p-4">
            <Megaphone className="h-5 w-5 text-muted-foreground" />
            <p className="mt-3 text-xs text-muted-foreground">Campanhas ativas</p>
            <p className="text-2xl font-semibold mt-0.5">--</p>
            <p className="text-[11px] text-muted-foreground mt-1">Em desenvolvimento</p>
          </div>
          <div className="rounded-lg border border-border bg-background/40 p-4">
            <LinkIcon className="h-5 w-5 text-muted-foreground" />
            <p className="mt-3 text-xs text-muted-foreground">Links inteligentes</p>
            <p className="text-2xl font-semibold mt-0.5">--</p>
            <p className="text-[11px] text-muted-foreground mt-1">Em desenvolvimento</p>
          </div>
          <div className="rounded-lg border border-border bg-background/40 p-4">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <p className="mt-3 text-xs text-muted-foreground">Comunicações</p>
            <p className="text-2xl font-semibold mt-0.5">--</p>
            <p className="text-[11px] text-muted-foreground mt-1">Em desenvolvimento</p>
          </div>
          <div className="rounded-lg border border-border bg-background/40 p-4">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
            <p className="mt-3 text-xs text-muted-foreground">Banners</p>
            <p className="text-2xl font-semibold mt-0.5">--</p>
            <p className="text-[11px] text-muted-foreground mt-1">Em desenvolvimento</p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card/60 p-5">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Download className="h-4 w-4 text-primary" /> Materiais para a rede</h3>
        <div className="text-sm text-muted-foreground">
          Sistema de gestão de materiais em desenvolvimento.
        </div>
      </div>
    </div>
  );
}
