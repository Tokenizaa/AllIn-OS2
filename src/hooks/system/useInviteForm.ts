import { useState } from "react";
import { UserRole } from "@/shared/types/roles";

interface UseInviteFormProps {
  createAdminInvite: (data: any) => Promise<void>;
}

export function useInviteForm({ createAdminInvite }: UseInviteFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "staff">("staff");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const handleTogglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]
    );
  };

  const handleCreateInvite = async (e: React.FormEvent, onClose?: () => void) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      await createAdminInvite({
        email,
        full_name: fullName,
        role: selectedRole,
        permissions: selectedPermissions,
        notes,
      });
      setFullName("");
      setEmail("");
      setSelectedRole("staff");
      setSelectedPermissions([]);
      setNotes("");
      onClose?.();
    } catch (err) {
      console.error("Error creating invite:", err);
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
