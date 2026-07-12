import { createFileRoute } from '@tanstack/react-router';
import { RouteGuard } from '@/modules/auth/guards/RouteGuard';

export const Route = createFileRoute('/admin/industrial/')({
  component: IndustrialDashboard,
});

function IndustrialDashboard() {
  return (
    <RouteGuard requiredPermission={{ module: "industrial", action: "read" }}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard Industrial</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Máquinas Ativas</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Matérias-Primas</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Processos</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Capacidade Utilizada</h3>
            <p className="text-3xl font-bold text-orange-600">0%</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Visão Geral</h2>
          <p className="text-gray-600">
            Bem-vindo ao módulo Industrial Foundation. Este módulo permite gerenciar máquinas, matérias-primas, processos e capacidades industriais.
          </p>
        </div>
      </div>
    </RouteGuard>
  );
}
