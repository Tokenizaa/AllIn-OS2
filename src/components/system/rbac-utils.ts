import { UserRole, ROLE_DISPLAY_NAMES } from "@/shared/types/roles";

export const getRoleLabel = (role: string): string => {
  return ROLE_DISPLAY_NAMES[role as UserRole] || role;
};

export const getRoleBadgeStyle = (role: string): string => {
  if (role === UserRole.ADMIN_MASTER || role === UserRole.GESTAO_ADMIN) {
    return "bg-rose-500/15 text-rose-400 border-rose-500/30";
  }
  if (role === UserRole.FINANCEIRO) {
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  }
  if (role === UserRole.SUPORTE) {
    return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
  }
  if (role === UserRole.AUDITOR || role === UserRole.ANALYTICS) {
    return "bg-purple-500/15 text-purple-400 border-purple-500/30";
  }
  if (role === UserRole.LOGISTICA || role === UserRole.OPERADOR || role === UserRole.MARKETING) {
    return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  }
  return "bg-slate-500/15 text-slate-400 border-slate-500/20";
};

