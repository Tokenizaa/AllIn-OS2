import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

import { CopilotDrawer } from "@/components/app/copilot-drawer";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { Topbar } from "@/components/app/topbar";
import { BaseLayout } from "@/components/shared/BaseLayout";
import { RouteGuard } from "@/modules/auth";
import { UserRole } from "@/shared/types/roles";

export const Route = createFileRoute("/admin")({
  component: AppLayoutSecure,
});

function AppLayoutSecure() {
  return (
    <RouteGuard allowedRoles={[UserRole.ADMIN_MASTER, UserRole.GESTAO_ADMIN, UserRole.FINANCEIRO, UserRole.SUPORTE, UserRole.LOGISTICA, UserRole.MARKETING, UserRole.ANALYTICS, UserRole.AUDITOR, UserRole.OPERADOR]}>
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
    <BaseLayout
      sidebar={<SidebarNav />}
      topbar={<Topbar onCopilot={() => setCopilotOpen(true)} />}
      drawer={<CopilotDrawer open={copilotOpen} onOpenChange={setCopilotOpen} />}
    />
  );
}
