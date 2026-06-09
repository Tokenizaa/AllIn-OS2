import React, { useState } from "react";
import { useAuth } from "@/modules/auth";
import { Mail } from "lucide-react";
import { useInviteFilters } from "@/hooks/invites/useInviteFilters";
import { useInviteForm } from "@/hooks/invites/useInviteForm";
import { useInviteActions } from "@/hooks/invites/useInviteActions";
import { InviteFilters } from "@/components/invites/InviteFilters";
import { CreateInviteDialog } from "@/components/invites/CreateInviteDialog";
import { InvitesTable } from "@/components/invites/InvitesTable";

export function InvitesManagement() {
  const { 
    adminInvites, createAdminInvite, revokeAdminInvite, resendAdminInvite
  } = useAuth();

  const [openInviteModal, setOpenInviteModal] = useState(false);

  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredInvites,
  } = useInviteFilters(adminInvites);

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
