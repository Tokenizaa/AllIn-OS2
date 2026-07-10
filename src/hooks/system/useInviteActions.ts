import { useState } from "react";

interface UseInviteActionsProps {
  revokeAdminInvite: (id: string) => Promise<void>;
  resendAdminInvite: (id: string) => Promise<void>;
}

export function useInviteActions({ revokeAdminInvite, resendAdminInvite }: UseInviteActionsProps) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopyLink = async (token: string) => {
    setCopiedToken(token);
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${window.location.origin}/auth/invite/${token}`);
      }
    } catch (err) {
      console.error("Error copying link:", err);
    }
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleRevokeInvite = async (id: string) => {
    try {
      await revokeAdminInvite(id);
    } catch (err) {
      console.error("Error revoking invite:", err);
    }
  };

  const handleResendInvite = async (id: string) => {
    try {
      await resendAdminInvite(id);
    } catch (err) {
      console.error("Error resending invite:", err);
    }
  };

  return {
    copiedToken,
    handleCopyLink,
    handleRevokeInvite,
    handleResendInvite,
  };
}
