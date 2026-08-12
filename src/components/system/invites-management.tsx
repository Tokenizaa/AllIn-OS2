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
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useInviteForm } from "@/hooks/system/useInviteForm";
import { useInviteActions } from "@/hooks/system/useInviteActions";

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
    handleCreateInvite(e, () => setOpenInviteModal(false));
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

const InviteFilters = ({ search, setSearch, statusFilter, setStatusFilter }: any) => {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Input
        placeholder="Buscar por nome ou e-mail..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-64"
      />
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="accepted">Aceito</SelectItem>
          <SelectItem value="revoked">Revogado</SelectItem>
          <SelectItem value="expired">Expirado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const CreateInviteDialog = ({
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
}: any) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          Criar Convite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Convite</DialogTitle>
          <DialogDescription>Crie um convite digital para um novo administrador</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateInvite} className="space-y-4">
          <Input placeholder="Nome completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input placeholder="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="distributor">Distributor</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Observações" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <DialogFooter>
            <Button type="submit" disabled={isSubmitLoading}>
              {isSubmitLoading ? "Criando..." : "Criar Convite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const InvitesTable = ({ filteredInvites, copiedToken, handleCopyLink, handleRevokeInvite, handleResendInvite }: any) => {
  if (!filteredInvites || filteredInvites.length === 0) {
    return <div className="p-8 text-center text-muted-foreground text-sm">Nenhum convite encontrado</div>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredInvites.map((inv: any) => (
          <TableRow key={inv.id}>
            <TableCell>{inv.full_name}</TableCell>
            <TableCell>{inv.email}</TableCell>
            <TableCell>{inv.role}</TableCell>
            <TableCell>
              <Badge>{inv.status}</Badge>
            </TableCell>
            <TableCell className="text-right space-x-1">
              <Button size="sm" variant="ghost" onClick={() => handleCopyLink(inv.invite_token)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleResendInvite(inv.id)}>
                <Send className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleRevokeInvite(inv.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
