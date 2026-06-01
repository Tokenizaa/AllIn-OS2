export const getRoleLabel = (role: string): string => {
  const roles: Record<string, string> = {
    admin_master: "Admin Master",
    finance: "Diretor Financeiro",
    support: "Suporte Técnico",
    distributor: "Distribuidor",
    customer: "Cliente Final",
    gestão_admin: "Gestor Administrativo",
    financeiro: "Analista Financeiro",
    suporte: "Suporte Técnico",
    logística: "Gestor Logístico",
    marketing: "Coord. Marketing",
    analytics: "Eng. Analytics",
    auditor: "Auditor Estrito",
    operador: "Operador de Caixa",
  };
  return roles[role] || role;
};

export const getRoleBadgeStyle = (role: string): string => {
  if (role === "admin_master" || role === "gestão_admin") {
    return "bg-rose-500/15 text-rose-400 border-rose-500/30";
  }
  if (role === "finance" || role === "financeiro") {
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  }
  if (role === "support" || role === "suporte") {
    return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
  }
  if (role === "auditor" || role === "analytics") {
    return "bg-purple-500/15 text-purple-400 border-purple-500/30";
  }
  if (role === "logística" || role === "operador" || role === "marketing") {
    return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  }
  return "bg-slate-500/15 text-slate-400 border-slate-500/20";
};

