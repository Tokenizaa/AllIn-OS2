import { createFileRoute } from '@tanstack/react-router';
import { RouteGuard } from '@/modules/auth/guards/RouteGuard';

export const Route = createFileRoute('/admin/industrial/materials')({
  component: IndustrialMaterials,
});

function IndustrialMaterials() {
  return (
    <RouteGuard requiredPermission={{ module: "industrial", action: "read" }}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Matérias-Primas</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Gestão de estoque de matérias-primas. Controle níveis de estoque, custos e fornecedores.
          </p>
        </div>
      </div>
    </RouteGuard>
  );
}
