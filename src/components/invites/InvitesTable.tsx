import { Mail, Shield, Copy, Check, RefreshCw, Trash2, Info, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRoleLabel, getRoleBadgeStyle } from "@/components/system/rbac-utils";

interface InvitesTableProps {
  filteredInvites: any[];
  copiedToken: string | null;
  handleCopyLink: (inviteLink: string, token: string) => void;
  handleRevokeInvite: (inviteId: string) => void;
  handleResendInvite: (inviteId: string) => void;
}

export function InvitesTable({
  filteredInvites,
  copiedToken,
  handleCopyLink,
  handleRevokeInvite,
  handleResendInvite,
}: InvitesTableProps) {
  if (filteredInvites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Mail className="h-10 w-10 text-muted-foreground/30 mb-2.5" />
        <p className="text-sm font-medium text-muted-foreground">Nenhum convite listado.</p>
        <p className="text-xs text-muted-foreground/60">Tente ajustar seus termos de busca ou crie um novo convite administrativo utilizando as diretrizes acima.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#0b0f19]/80 border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">Convidado</th>
            <th className="px-4 py-3 text-left">Nível / Role Proposta</th>
            <th className="px-4 py-3 text-left">Audit Emitente</th>
            <th className="px-4 py-3 text-left">Validade Link (48h)</th>
            <th className="px-4 py-3 text-left">Status Evento</th>
            <th className="px-4 py-3 text-right">Controles Enterprise</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {filteredInvites.map((inv) => (
            <tr key={inv.id} className="hover:bg-accent/20 transition-colors">
              <td className="px-4 py-3.5">
                <div className="flex flex-col leading-tight max-w-[150px] md:max-w-none">
                  <span className="font-medium text-white truncate">{inv.full_name}</span>
                  <span className="text-xs text-muted-foreground font-mono truncate">{inv.email}</span>
                  {inv.notes && (
                    <div className="text-[10px] text-muted-foreground/75 mt-0.5 italic flex items-center gap-1">
                      <Info className="h-2.5 w-2.5 text-primary/80 shrink-0" />
                      <span className="truncate">{inv.notes}</span>
                    </div>
                  )}
                </div>
              </td>

              <td className="px-4 py-3.5">
                <div className="flex flex-col gap-1 w-fit">
                  <Badge variant="outline" className={`text-[10px] font-medium leading-none py-0.5 px-1.5 ${getRoleBadgeStyle(inv.role)}`}>
                    <Shield className="h-2.5 w-2.5 mr-1" />
                    {getRoleLabel(inv.role)}
                  </Badge>
                  {inv.permissions.length > 0 && (
                    <span className="text-[9px] text-muted-foreground font-mono">
                      Mod: {inv.permissions.join(", ")}
                    </span>
                  )}
                </div>
              </td>

              <td className="px-4 py-3.5">
                <div className="text-xs text-muted-foreground/90 font-mono">
                  {inv.invited_by}
                </div>
              </td>

              <td className="px-4 py-3.5">
                <div className="flex flex-col text-[11px] font-mono leading-tight">
                  <span className="text-muted-foreground/85">
                    Até: {new Date(inv.expires_at).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="text-[10px] opacity-65">
                    Hora: {new Date(inv.expires_at).toLocaleTimeString("pt-BR", {hour:"2-digit", minute:"2-digit"})}
                  </span>
                </div>
              </td>

              <td className="px-4 py-3.5">
                {inv.status === "pending" ? (
                  <span className="inline-flex items-center gap-1 text-xs text-cyan-400 font-medium">
                    <Clock className="h-3 w-3 animate-pulse text-cyan-400 shrink-0" />
                    Pendente
                  </span>
                ) : inv.status === "accepted" ? (
                  <div className="flex flex-col leading-tight">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      Ativado
                    </span>
                    {inv.accepted_at && (
                      <span className="text-[9px] font-mono text-muted-foreground/60">
                        Em: {new Date(inv.accepted_at).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                ) : inv.status === "expired" ? (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <XCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    Expirado
                  </span>
                ) : (
                  <div className="flex flex-col leading-tight">
                    <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-medium">
                      <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      Cancelado
                    </span>
                    {inv.revoked_at && (
                      <span className="text-[9px] font-mono text-muted-foreground/60">
                        Em: {new Date(inv.revoked_at).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                )}
              </td>

              <td className="px-4 py-3.5 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {inv.status === "pending" && (
                    <Button
                      onClick={() => handleCopyLink(inv.invite_link, inv.invite_token)}
                      variant="outline"
                      className="h-8 w-8 p-0 rounded-md border-slate-800 text-slate-400 hover:text-white"
                      title="Copiar Link Seguro"
                    >
                      {copiedToken === inv.invite_token ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  )}

                  {inv.status === "pending" && (
                    <a
                      href={`/auth/invite/${inv.invite_token}`}
                      className="inline-flex h-8 px-2.5 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-[10px] font-bold text-primary hover:bg-primary/20 transition-colors"
                      title="Simular Acesso do Candidato"
                    >
                      Ir p/ Ativação
                    </a>
                  )}

                  {(inv.status === "expired" || inv.status === "revoked") && (
                    <Button
                      onClick={() => handleResendInvite(inv.id)}
                      variant="outline"
                      className="h-8 w-8 p-0 rounded-md border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850"
                      title="Reenviar de Formato Renovado (+48h)"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  )}

                  {inv.status === "pending" && (
                    <Button
                      onClick={() => handleRevokeInvite(inv.id)}
                      variant="outline"
                      className="h-8 w-8 p-0 rounded-md border-rose-500/15 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30"
                      title="Revogar e Invalidar Token"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
