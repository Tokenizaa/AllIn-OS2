import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { b as useAuth, j as getPrimaryPathForRole, f as getRoleRedirectPath } from "./router-Piw3VGP8.js";
const ROLE_PERMISSIONS = {
  admin_master: [
    { id: "p1", module: "dashboard", action: "all", description: "Acesso total ao Dashboard executivo" },
    { id: "p2", module: "analytics", action: "all", description: "Ver relatórios e analytics globais" },
    { id: "p3", module: "finance", action: "all", description: "Gerenciar pagamentos, saques e bônus" },
    { id: "p4", module: "support", action: "all", description: "Visualizar e atualizar chamados e KYC" },
    { id: "p5", module: "network", action: "all", description: "Ver árvore unilevel e binária global" },
    { id: "p6", module: "orders", action: "all", description: "Gerenciar todos os pedidos e logística" },
    { id: "p7", module: "products", action: "all", description: "Criar, editar e excluir produtos" },
    { id: "p8", module: "marketing", action: "all", description: "Disparar campanhas e banners corporativos" },
    { id: "p9", module: "settings", action: "all", description: "Modificar regras comissões e gateways" },
    { id: "p10", module: "system", action: "all", description: "Acesso total a auditoria e banco de dados" }
  ],
  gestao_admin: [
    { id: "ga1", module: "dashboard", action: "all", description: "Acesso total ao Dashboard executivo" },
    { id: "ga2", module: "analytics", action: "all", description: "Estatísticas gerenciais completas" },
    { id: "ga3", module: "support", action: "all", description: "Gerenciamento de tickets" },
    { id: "ga4", module: "orders", action: "all", description: "Controle operacional de pedidos" },
    { id: "ga5", module: "products", action: "all", description: "Catálogo de produtos" },
    { id: "ga6", module: "marketing", action: "all", description: "Campanhas de Marketing" },
    { id: "ga7", module: "system", action: "read", description: "Verificação de logs" }
  ],
  financeiro: [
    { id: "fin1", module: "dashboard", action: "read", description: "Resumos de faturamento" },
    { id: "fin2", module: "analytics", action: "read", description: "Painéis de faturamento e lucro" },
    { id: "fin3", module: "finance", action: "manage", description: "Controle de saques e liquidações" },
    { id: "fin4", module: "orders", action: "read", description: "Visualização de pedidos faturados" }
  ],
  suporte: [
    { id: "sup1", module: "dashboard", action: "read", description: "Visualizar tickets de suporte" },
    { id: "sup2", module: "support", action: "manage", description: "Responder e gerenciar tickets de suporte" },
    { id: "sup3", module: "orders", action: "read", description: "Rastreamento e detalhes de pedidos" }
  ],
  logistica: [
    { id: "log1", module: "dashboard", action: "read", description: "Estatísticas de expedição" },
    { id: "log2", module: "orders", action: "manage", description: "Controle completo de remessas e expedição" },
    { id: "log3", module: "products", action: "read", description: "Consultar estoque e produtos" }
  ],
  marketing: [
    { id: "mkt1", module: "dashboard", action: "read", description: "Visualizar dados básicos" },
    { id: "mkt2", module: "marketing", action: "manage", description: "Gestão completa de campanhas de marketing" },
    { id: "mkt3", module: "products", action: "read", description: "Consulta ao catálogo de produtos" }
  ],
  analytics: [
    { id: "an1", module: "dashboard", action: "read", description: "Visualização de dashboards" },
    { id: "an2", module: "analytics", action: "all", description: "Análises avançadas e relatórios enterprise" }
  ],
  auditor: [
    { id: "aud1", module: "dashboard", action: "read", description: "Visualização de Auditoria" },
    { id: "aud2", module: "analytics", action: "read", description: "Leitura de relatórios de dados" },
    { id: "aud3", module: "finance", action: "read", description: "Auditoria de fluxos de caixa" },
    { id: "aud4", module: "system", action: "read", description: "Auditoria estrita de logs" }
  ],
  operador: [
    { id: "ope1", module: "dashboard", action: "read", description: "Dashboard operacional básico" },
    { id: "ope2", module: "orders", action: "write", description: "Lançamento e edição operacional de pedidos" },
    { id: "ope3", module: "support", action: "read", description: "Leitura de tickets básicos" }
  ],
  distribuidor: [
    { id: "d1", module: "dashboard", action: "read", description: "Ver painel de bônus e estatísticas próprias" },
    { id: "d2", module: "network", action: "read", description: "Ver rede de cadastrados indicados diretos e indiretos" },
    { id: "d3", module: "orders", action: "write", description: "Fazer novos pedidos pessoais e acompanhar entrega" },
    { id: "d4", module: "finance", action: "write", description: "Solicitar transferências e saques das carteiras" }
  ],
  afiliado: [
    { id: "af1", module: "dashboard", action: "read", description: "Ver painel de comissões" },
    { id: "af2", module: "network", action: "read", description: "Ver rede de indicados" },
    { id: "af3", module: "orders", action: "read", description: "Acompanhar pedidos da rede" }
  ],
  cliente_final: [
    { id: "c1", module: "orders", action: "write", description: "Realizar compras de produtos e acompanhar pedidos" },
    { id: "c2", module: "dashboard", action: "read", description: "Acessar histórico de compras e carteira de cashback" }
  ]
};
const usePermissions = () => {
  const { user } = useAuth();
  const getPermissions = () => {
    if (!user) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  };
  const hasPermission = (module, action = "read") => {
    if (!user) return false;
    if (user.role === "admin_master") return true;
    const perms = getPermissions();
    return perms.some(
      (p) => p.module === module && (p.action === "all" || p.action === "manage" || p.action === action)
    );
  };
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };
  const isRole = (role) => hasRole(role);
  const canRead = (module) => {
    return hasPermission(module, "read");
  };
  const canWrite = (module) => {
    return hasPermission(module, "write");
  };
  const canDelete = (module) => {
    return hasPermission(module, "delete");
  };
  const canManage = (module) => {
    return hasPermission(module, "manage") || hasPermission(module, "all");
  };
  return {
    permissions: getPermissions(),
    hasPermission,
    hasRole,
    canRead,
    canWrite,
    canDelete,
    canManage,
    isRole,
    isLoading: false,
    role: user?.role || null
  };
};
const PATH_PERMISSION_MAP = [
  { pattern: /^\/system(?:\/|$)/, permission: { module: "system", action: "read" } },
  { pattern: /^\/wallets(?:\/|$)/, permission: { module: "finance", action: "read" } },
  { pattern: /^\/analytics(?:\/|$)/, permission: { module: "analytics", action: "read" } },
  { pattern: /^\/insights(?:\/|$)/, permission: { module: "analytics", action: "read" } },
  { pattern: /^\/alerts(?:\/|$)/, permission: { module: "dashboard", action: "read" } },
  { pattern: /^\/customers(?:\/|$)/, permission: { module: "support", action: "read" } },
  { pattern: /^\/orders(?:\/|$)/, permission: { module: "orders", action: "read" } },
  { pattern: /^\/products(?:\/|$)/, permission: { module: "products", action: "read" } },
  { pattern: /^\/network(?:\/|$)/, permission: { module: "network", action: "read" } },
  { pattern: /^\/commissions(?:\/|$)/, permission: { module: "finance", action: "read" } },
  { pattern: /^\/marketing(?:\/|$)/, permission: { module: "marketing", action: "read" } },
  { pattern: /^\/settings(?:\/|$)/, permission: { module: "settings", action: "read" } },
  { pattern: /^\/office(?:\/|$)/, permission: { module: "dashboard", action: "read" } }
];
function resolvePathPermission(pathname) {
  return PATH_PERMISSION_MAP.find((entry) => entry.pattern.test(pathname))?.permission || null;
}
const RouteGuard = ({ children, allowedRoles, requiredPermission }) => {
  const { user, loading } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const inferredPermission = requiredPermission || resolvePathPermission(location.pathname);
  console.log("[RouteGuard] Render. path:", location.pathname, "loading:", loading, "hasUser:", !!user, "userRole:", user?.role, "allowedRoles:", allowedRoles);
  useEffect(() => {
    console.log("[RouteGuard] useEffect fired. path:", location.pathname, "loading:", loading, "hasUser:", !!user, "userRole:", user?.role);
    if (!loading) {
      if (!user) {
        console.log("[RouteGuard] No user found. Redirecting to /login from:", location.pathname);
        navigate({
          to: "/login",
          search: location.pathname === "/" ? void 0 : { redirect: location.pathname }
        });
        return;
      }
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.log("[RouteGuard] Role mismatch! user.role:", user.role, "is not in:", allowedRoles);
        navigate({ to: getPrimaryPathForRole(user.role) });
        return;
      }
      if (inferredPermission && !hasPermission(inferredPermission.module, inferredPermission.action || "read")) {
        console.log("[RouteGuard] Missing permission. module:", inferredPermission.module, "action:", inferredPermission.action);
        navigate({ to: getRoleRedirectPath(user) });
      }
    }
  }, [user, loading, allowedRoles, inferredPermission, navigate, location.pathname, hasPermission]);
  if (loading) {
    console.log("[RouteGuard] Still loading, showing loader spinner.");
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center bg-[#07090e] text-white", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent" }),
        /* @__PURE__ */ jsx("div", { className: "absolute h-6 w-6 animate-ping rounded-full bg-primary/20" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-xs font-mono text-muted-foreground uppercase tracking-wider", children: "Iniciando ambiente de segurança..." })
    ] });
  }
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;
  if (inferredPermission && !hasPermission(inferredPermission.module, inferredPermission.action || "read")) return null;
  return /* @__PURE__ */ jsx(Fragment, { children });
};
export {
  RouteGuard as R,
  usePermissions as u
};
