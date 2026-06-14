import { createFileRoute } from '@tanstack/react-router';
import { PermissionGuard } from '@/modules/auth/guards/PermissionGuard';

export const Route = createFileRoute('/_app/industrial/machines')({
  component: IndustrialMachines,
});

function IndustrialMachines() {
  return (
    <PermissionGuard module="industrial" action="read">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Máquinas</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Gestão de máquinas industriais. Crie, edite e monitore o status das máquinas de produção.
          </p>
        </div>
      </div>
    </PermissionGuard>
  );
}
