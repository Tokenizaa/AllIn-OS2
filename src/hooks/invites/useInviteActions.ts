import { useState } from "react";
import { toast } from "sonner";

interface UseInviteActionsProps {
  revokeAdminInvite: any;
  resendAdminInvite: any;
}

export function useInviteActions({ revokeAdminInvite, resendAdminInvite }: UseInviteActionsProps) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopyLink = async (inviteLink: string, token: string) => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedToken(token);
      toast.success("Link do convite copiado!");
      setTimeout(() => setCopiedToken(null), 1500);
    } catch {
      toast.error("Erro ao copiar para a área de transferência.");
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      await revokeAdminInvite(inviteId);
      toast.success("Convite revogado com sucesso. Token cancelado e inutilizável.");
    } catch {
      toast.error("Não foi possível cancelar o enlace.");
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      await resendAdminInvite(inviteId);
      toast.success("Convite renovado com sucesso! Novo token gerado e estendido por mais 48h.");
    } catch {
      toast.error("Erro ao reemitir credencial temporária.");
    }
  };

  return {
    copiedToken,
    handleCopyLink,
    handleRevokeInvite,
    handleResendInvite,
  };
}
