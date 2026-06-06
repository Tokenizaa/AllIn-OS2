import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "@/shared/types/roles";

interface UseInviteFormProps {
  createAdminInvite: any;
}

export function useInviteForm({ createAdminInvite }: UseInviteFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.GESTAO_ADMIN);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const handleTogglePermission = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
    );
  };

  const handleCreateInvite = async (e: React.FormEvent, setOpenInviteModal: (open: boolean) => void) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast.error("Por favor, preencha o Nome Completo e o E-mail.");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Insira um endereço de e-mail corporativo válido.");
      return;
    }

    setIsSubmitLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newInv = await createAdminInvite({
        full_name: fullName,
        email: email,
        role: selectedRole,
        permissions: selectedPermissions,
        notes: notes,
        invited_by: "system"
      });

      toast.success(
        `Convite administrativo criado e enviado com sucesso para ${email}!`
      );
      
      try {
        await navigator.clipboard.writeText(newInv.invite_link);
        toast.info("Link do convite copiado automaticamente na Área de Trabalho!");
      } catch {
        // Fallback silencioso
      }

      setFullName("");
      setEmail("");
      setSelectedRole(UserRole.GESTAO_ADMIN);
      setSelectedPermissions([]);
      setNotes("");
      setOpenInviteModal(false);
    } catch {
      toast.error("Não foi possível gerar a credencial.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return {
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
  };
}
