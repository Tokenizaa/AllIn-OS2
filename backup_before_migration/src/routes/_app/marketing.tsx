import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/widgets/page-header";
import { Megaphone, Link as LinkIcon, Mail, Image as ImageIcon, Download, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useCampaigns } from "@/hooks/marketing/useCampaigns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/marketing")({ component: MarketingPage });

function MarketingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState("");
  const { data: campaigns, isLoading, refetch } = useCampaigns();

  const activeCampaigns = campaigns?.filter((c: any) => c.status === "active") || [];
  const totalLinks = campaigns?.reduce((sum: number, c: any) => sum + (c.links_count || 0), 0) || 0;
  const totalCommunications = campaigns?.reduce((sum: number, c: any) => sum + (c.communications_sent || 0), 0) || 0;
  const totalBanners = campaigns?.reduce((sum: number, c: any) => sum + (c.banners_count || 0), 0) || 0;

  const handleCreateCampaign = async () => {
    if (!campaignName || !campaignType) return;
    try {
      // This would call a service to create the campaign in Supabase
      // For now, we'll simulate the creation
      toast.success(`Campanha "${campaignName}" criada com sucesso!`);
      setIsDialogOpen(false);
      setCampaignName("");
      setCampaignType("");
      refetch();
    } catch (error) {
      toast.error("Erro ao criar campanha. Tente novamente.");
    }
  };

  const statusColors: Record<string, string> = {
    active: "bg-success/15 text-success border-success/30",
    scheduled: "bg-warning/15 text-warning border-warning/30",
    completed: "bg-muted text-muted-foreground border-border",
    draft: "bg-info/15 text-info border-info/30",
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Marketing" title="Campanhas & Comunicação" subtitle="Gerencie campanhas de marketing e comunicação com a rede." actions={
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
            <Megaphone className="h-5 w-5 text-primary" />
            <p className="mt-3 text-xs text-muted-foreground">Campanhas ativas</p>
            <p className="text-2xl font-semibold mt-0.5">{isLoading ? "..." : activeCampaigns.length}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Total: {campaigns?.length || 0}</p>
          </div>
          <div className="rounded-lg border border-border bg-background/40 p-4">
            <LinkIcon className="h-5 w-5 text-primary" />
            <p className="mt-3 text-xs text-muted-foreground">Links inteligentes</p>
            <p className="text-2xl font-semibold mt-0.5">{isLoading ? "..." : totalLinks}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Rastreados</p>
          </div>
          <div className="rounded-lg border border-border bg-background/40 p-4">
            <Mail className="h-5 w-5 text-primary" />
            <p className="mt-3 text-xs text-muted-foreground">Comunicações</p>
            <p className="text-2xl font-semibold mt-0.5">{isLoading ? "..." : totalCommunications}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Enviadas</p>
          </div>
          <div className="rounded-lg border border-border bg-background/40 p-4">
            <ImageIcon className="h-5 w-5 text-primary" />
            <p className="mt-3 text-xs text-muted-foreground">Banners</p>
            <p className="text-2xl font-semibold mt-0.5">{isLoading ? "..." : totalBanners}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Disponíveis</p>
          </div>
        </div>
      </div>
      
      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold">Campanhas Recentes</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 text-left">Nome</th>
              <th className="px-4 py-2.5 text-left">Tipo</th>
              <th className="px-4 py-2.5 text-left">Status</th>
              <th className="px-4 py-2.5 text-right">Enviados</th>
              <th className="px-4 py-2.5 text-left">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Carregando campanhas...
                </td>
              </tr>
            ) : !campaigns || campaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhuma campanha encontrada. Crie sua primeira campanha para começar.
                </td>
              </tr>
            ) : (
              campaigns.slice(0, 10).map((campaign: any) => (
                <tr key={campaign.id} className="hover:bg-accent/30">
                  <td className="px-4 py-3 font-medium">{campaign.name}</td>
                  <td className="px-4 py-3 capitalize">{campaign.type}</td>
                  <td className="px-4 py-3">
                    <Badge className={statusColors[campaign.status] || statusColors.draft}>
                      {campaign.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{campaign.communications_sent || 0}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString("pt-BR") : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-5">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Download className="h-4 w-4 text-primary" /> Materiais para a rede</h3>
        <div className="text-sm text-muted-foreground mb-4">
          Baixe materiais de marketing prontos para uso da sua rede.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: "Kit de Lançamento", type: "PDF", size: "2.4 MB" },
            { name: "Banners Redes Sociais", type: "ZIP", size: "15.8 MB" },
            { name: "Apresentação Comercial", type: "PPTX", size: "8.1 MB" },
          ].map((material, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-3">
              <div>
                <p className="text-sm font-medium">{material.name}</p>
                <p className="text-xs text-muted-foreground">{material.type} · {material.size}</p>
              </div>
              <Button size="sm" variant="ghost">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
