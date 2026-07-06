import React, { useState } from "react";
import { useAuth } from "@/modules/auth";
import { UserRole } from "@/shared/types/roles";
import { 
  Mail, Search, Shield, Plus, CheckCircle2, Clock, XCircle,
  Copy, Check, Trash2, Send, RefreshCw, Layers, Info
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { getRoleLabel, getRoleBadgeStyle } from "./rbac-utils";
import { toast } from "sonner";

export function InvitesManagement() {
  const { 
    adminInvites, createAdminInvite, revokeAdminInvite, resendAdminInvite
  } = useAuth();

  // Search, filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openInviteModal, setOpenInviteModal] = useState(false);

  const {
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
  } = useInviteForm({ createAdminInvite });

  const {
    copiedToken,
    handleCopyLink,
    handleRevokeInvite,
    handleResendInvite,
  } = useInviteActions({ revokeAdminInvite, resendAdminInvite });

  const handleCreateInviteWrapper = (e: React.FormEvent) => {
    handleCreateInvite(e, setOpenInviteModal);
  };

  // Filter criteria
  const filteredInvites = adminInvites.filter(inv => {
    const matchesSearch = 
      inv.full_name.toLowerCase().includes(search.toLowerCase()) || 
      inv.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header filter metrics */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <InviteFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Action Button: Show slide-out to construct invite */}
        <CreateInviteDialog
          open={openInviteModal}
          onOpenChange={setOpenInviteModal}
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedPermissions={selectedPermissions}
          setSelectedPermissions={setSelectedPermissions}
          notes={notes}
          setNotes={setNotes}
          isSubmitLoading={isSubmitLoading}
          handleTogglePermission={handleTogglePermission}
          handleCreateInvite={handleCreateInviteWrapper}
        />
      </div>

      {/* Grid containing invitations lists */}
      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
        <div className="px-4 py-3 bg-card/60 border-b border-border flex items-center gap-1.5">
          <Mail className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Enlaces Digitais de Admissão ({filteredInvites.length})</h3>
        </div>

        <InvitesTable
          filteredInvites={filteredInvites}
          copiedToken={copiedToken}
          handleCopyLink={handleCopyLink}
          handleRevokeInvite={handleRevokeInvite}
          handleResendInvite={handleResendInvite}
        />
      </div>
    </div>
  );
}
