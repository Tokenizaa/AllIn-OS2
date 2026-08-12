import { createFileRoute } from "@tanstack/react-router";
import { OfficeSidebar } from "@/components/distributor/sidebar";
import { OfficeTopbar } from "@/components/distributor/topbar";
import { BaseLayout } from "@/components/shared/BaseLayout";
import { RouteGuard } from "@/modules/auth";
import { UserRole } from "@/shared/types/roles";

export const Route = createFileRoute("/distributor")({
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
    <BaseLayout
      sidebar={<OfficeSidebar />}
      topbar={<OfficeTopbar />}
      maxWidth="1500px"
    />
  );
}
