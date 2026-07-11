import { Bell, Boxes, Factory, Layers, LayoutDashboard, Megaphone, Network, Settings2, ShieldCheck, ShoppingBag, Sparkles, Users, Wallet } from "lucide-react";

export type AppNavModule =
  | "dashboard"
  | "analytics"
  | "finance"
  | "support"
  | "network"
  | "orders"
  | "products"
  | "marketing"
  | "settings"
  | "system"
  | "industrial"
  | "customers"
  | "distributors";

export type AppNavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  module: AppNavModule;
};

export type AppNavSection = {
  label: string;
  items: AppNavItem[];
};

export const APP_NAV_SECTIONS: AppNavSection[] = [
  {
    label: "Executivo",
    items: [
      { to: "/analytics", label: "Dashboard Executivo", icon: LayoutDashboard, module: "dashboard" },
      { to: "/insights", label: "Insights", icon: Sparkles, module: "analytics" },
      { to: "/alerts", label: "Alertas", icon: Bell, module: "dashboard" },
    ],
  },
{
    label: "CRM",
    items: [
      { to: "/_app/customers", label: "Clientes", icon: Users, module: "support" },
      { to: "/_app/distributors", label: "Distribuidores", icon: Network, module: "network" },
    ],
  },
  {
    label: "Rede",
    items: [
      { to: "/network", label: "Genealogia", icon: Network, module: "network" },
      { to: "/commissions", label: "Comissoes", icon: Wallet, module: "finance" },
    ],
  },
  {
    label: "Comercial",
    items: [
      { to: "/orders", label: "Pedidos", icon: ShoppingBag, module: "orders" },
      { to: "/products", label: "Produtos", icon: Boxes, module: "products" },
      { to: "/plans", label: "Planos", icon: Layers, module: "products" },
    ],
  },
  {
    label: "Industrial",
    items: [
      { to: "/industrial", label: "Dashboard Industrial", icon: Factory, module: "industrial" },
      { to: "/industrial/machines", label: "Máquinas", icon: Factory, module: "industrial" },
      { to: "/industrial/materials", label: "Matérias-Primas", icon: Boxes, module: "industrial" },
      { to: "/industrial/processes", label: "Processos", icon: Layers, module: "industrial" },
    ],
  },
  {
    label: "Financeiro",
    items: [{ to: "/wallets", label: "Carteiras", icon: Wallet, module: "finance" }],
  },
  {
    label: "Marketing",
    items: [{ to: "/marketing", label: "Campanhas", icon: Megaphone, module: "marketing" }],
  },
  {
    label: "Sistema",
    items: [
      { to: "/system", label: "Admin & Auditoria", icon: ShieldCheck, module: "system" },
      { to: "/settings", label: "Configuracoes", icon: Settings2, module: "settings" },
    ],
  },
];
