import { Suspense } from "react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { OfficeSidebar } from "@/components/distributor/sidebar";
import { OfficeTopbar } from "@/components/distributor/topbar";
import { RouteGuard } from "@/modules/auth";
import { UserRole } from "@/shared/types/roles";

export const Route = createFileRoute("/office")({
  component: OfficeLayoutSecure,
});

function OfficeLayoutSecure() {
  return (
    <RouteGuard allowedRoles={[
      UserRole.DISTRIBUIDOR,
      UserRole.AFILIADO,
      UserRole.ADMIN_MASTER,
      UserRole.GESTAO_ADMIN,
      UserRole.FINANCEIRO,
      UserRole.SUPORTE,
      UserRole.LOGISTICA,
      UserRole.MARKETING,
      UserRole.ANALYTICS,
      UserRole.AUDITOR,
      UserRole.OPERADOR
    ]}>
      <OfficeLayout />
    </RouteGuard>
  );
}

function OfficeLayout() {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <OfficeSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <OfficeTopbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1500px] px-4 md:px-8 py-6 md:py-8">
            <Suspense fallback={<div className="h-32 animate-pulse bg-muted rounded-lg" />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
