import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { CopilotDrawer } from "@/components/app/copilot-drawer";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { Topbar } from "@/components/app/topbar";
import { RouteGuard, useAuth } from "@/modules/auth";
import { UserRole } from "@/shared/types/roles";

export const Route = createFileRoute("/_app")({
  component: AppLayoutSecure,
});

function AppLayoutSecure() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#06080d]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <RouteGuard allowedRoles={[
      UserRole.ADMIN_MASTER,
      UserRole.GESTAO_ADMIN,
      UserRole.FINANCEIRO,
      UserRole.SUPORTE,
      UserRole.LOGISTICA,
      UserRole.MARKETING,
      UserRole.ANALYTICS,
      UserRole.AUDITOR,
      UserRole.OPERADOR,
      UserRole.DISTRIBUIDOR,
      UserRole.AFILIADO
    ]}>
      <AppLayout />
    </RouteGuard>
  );
}

function AppLayout() {
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCopilotOpen((value) => !value);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onCopilot={() => setCopilotOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <CopilotDrawer open={copilotOpen} onOpenChange={setCopilotOpen} />
    </div>
  );
}
