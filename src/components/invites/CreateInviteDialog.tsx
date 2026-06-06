import { UserRole } from "@/shared/types/roles";
import { Mail, Plus, Send, RefreshCw, Layers, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";

const PERMISSION_OPTIONS = [
  { id: "dashboard", label: "Dashboard Executivo", desc: "Leitura de KPIs e estatísticas rápidas." },
  { id: "analytics", label: "Relatórios & Analytics", desc: "Análise avançada e projeções MLM." },
  { id: "finance", label: "Painel Financeiro", desc: "Visualizar e movimentar carteiras." },
  { id: "support", label: "Suporte e Documentos", desc: "Central de tickets e compliance de KYC." },
  { id: "orders", label: "Faturamento de Pedidos", desc: "Expedição de mercadorias e status de compras." },
  { id: "products", label: "Gestão do Catálogo", desc: "Preços, itens e planos cadastrados." },
  { id: "marketing", label: "Campanhas Corporativas", desc: "Notificações push, cupons e banners." },
  { id: "system", label: "Auditoria & Logs", desc: "Monitoramento detalhado e segurança de rede." },
];

interface CreateInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  selectedPermissions: string[];
  setSelectedPermissions: (permissions: string[]) => void;
  notes: string;
  setNotes: (value: string) => void;
  isSubmitLoading: boolean;
  handleTogglePermission: (permId: string) => void;
  handleCreateInvite: (e: React.FormEvent) => void;
}

export function CreateInviteDialog({
  open,
  onOpenChange,
  fullName,
  setFullName,
  email,
  setEmail,
  selectedRole,
  setSelectedRole,
  selectedPermissions,
  setSelectedPermissions,
  notes,
  setNotes,
  isSubmitLoading,
  handleTogglePermission,
  handleCreateInvite,
}: CreateInviteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto bg-gradient-to-r from-primary to-fuchsia-600 hover:from-primary/95 hover:to-fuchsia-600/95 font-medium rounded-lg text-xs tracking-wide">
          <Plus className="h-4 w-4 mr-1 shrink-0" />
          Novo Convite Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl bg-[#090d16] border border-border shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-1.5">
            <Mail className="h-5 w-5 text-primary" />
            Criar Enlace de Convite Corporativo
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Crie um cadastro temporário seguro com privilégios de controle da empresa. O destinatário receberá um e-mail securitizado para configurar sua própria senha de login.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateInvite} className="space-y-4 py-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Nome Completo do Convidado *</label>
              <Input 
                placeholder="Ex: Gabriel Oliver" 
                className="bg-background/40"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">E-mail Corporativo *</label>
              <Input 
                type="email"
                placeholder="gabriel@allin.io" 
                className="bg-background/40"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Cargo com Políticas de Permissão Padrão (RBAC) *</label>
            <Select value={selectedRole} onValueChange={(val) => {
              setSelectedRole(val as UserRole);
              const defaults: Record<string, string[]> = {
                gestão_admin: ["dashboard", "analytics", "support", "orders", "products"],
                financeiro: ["dashboard", "analytics", "finance", "orders"],
                suporte: ["dashboard", "support", "orders"],
                logística: ["dashboard", "orders", "products"],
                marketing: ["dashboard", "marketing", "products"],
                analytics: ["dashboard", "analytics"],
                auditor: ["dashboard", "analytics", "finance", "system"],
                operador: ["dashboard", "orders"]
              };
              setSelectedPermissions(defaults[val] || []);
            }}>
              <SelectTrigger className="bg-background/40 border-border">
                <SelectValue placeholder="Selecione o cargo estratégico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gestão_admin">Gestão Admin (Acesso amplo de equipe, produtos e pedidos)</SelectItem>
                <SelectItem value="financeiro">Financeiro (Gerenciador de saques e liquidações de bônus)</SelectItem>
                <SelectItem value="suporte">Suporte Técnico (Tratamento de chamados e aprovação de KYC)</SelectItem>
                <SelectItem value="logística">Logística (Faturamento e despacho operacional de compras)</SelectItem>
                <SelectItem value="marketing">Marketing (Organização de banners e campanhas MLM)</SelectItem>
                <SelectItem value="analytics">Analytics (Leitor de faturamento, rede e conexões)</SelectItem>
                <SelectItem value="auditor">Auditor Estrito (Leitor em tempo real imutável de logs e caixas)</SelectItem>
                <SelectItem value="operador">Operador de Staff (Organizador de expedição e tickets básicos)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-black/30 p-3">
            <div className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold text-white">Módulos Adicionais Concedidos</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-snug">
              Personalize acessos à parte das regras padrão herdadas pela role administrativa.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-1.5 border-t border-border/40">
              {PERMISSION_OPTIONS.map((opt) => {
                const checked = selectedPermissions.includes(opt.id);
                return (
                  <div 
                    key={opt.id} 
                    onClick={() => handleTogglePermission(opt.id)}
                    className={`flex items-start gap-2 p-1.5 rounded-md border cursor-pointer select-none transition-colors ${
                      checked 
                        ? "bg-primary/5 border-primary/40 text-white" 
                        : "border-slate-800/60 hover:border-slate-700/80 text-muted-foreground/90"
                    }`}
                  >
                    <div className={`h-3.5 w-3.5 rounded mt-0.5 border flex items-center justify-center shrink-0 ${
                      checked ? "border-primary bg-primary text-primary-foreground" : "border-slate-700"
                    }`}>
                      {checked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    </div>
                    <div className="flex flex-col min-w-0 leading-tight">
                      <span className="text-[11px] font-semibold">{opt.label}</span>
                      <span className="text-[9px] opacity-70 truncate">{opt.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Observações Internas (Opcional)</label>
            <textarea 
              placeholder="Instruções internas ou escopo da contração..." 
              className="w-full h-16 rounded-md bg-background/40 border border-border p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2 items-center flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="rounded-lg h-9 text-xs"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitLoading}
              className="bg-primary hover:bg-primary/95 text-xs h-9 font-medium tracking-wide rounded-lg shrink-0"
            >
              {isSubmitLoading ? (
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Emitindo Credencial...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Send className="h-3 w-3 mr-1" />
                  Registrar & Salvar Convite
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
