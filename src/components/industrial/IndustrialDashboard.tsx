import { useState, useEffect } from 'react';
import { industrialService } from '@/services/industrial';

interface KPICard {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  icon?: string;
}

export function IndustrialDashboard() {
  const [kpis, setKPIs] = useState<KPICard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from various sources
      const [machines, processes, products, capacity] = await Promise.all([
        industrialService.getMachines(),
        industrialService.getProcesses(),
        industrialService.getProductsIndustrial(),
        industrialService.getCapacity(),
      ]);

      // Calculate KPIs
      const dashboardKPIs: KPICard[] = [
        {
          title: 'Máquinas Ativas',
          value: machines.data?.filter((m: any) => m.status === 'ativa').length || 0,
          unit: 'unidades',
          icon: '🏭',
        },
        {
          title: 'Processos Configurados',
          value: processes.data?.length || 0,
          unit: 'processos',
          icon: '⚙️',
        },
        {
          title: 'Produtos Industriais',
          value: products.data?.length || 0,
          unit: 'produtos',
          icon: '📦',
        },
        {
          title: 'Capacidade Total',
          value: capacity.data?.reduce((acc: number, c: any) => acc + (c.capacidade_teorica || 0), 0) || 0,
          unit: 'unidades/dia',
          icon: '📊',
        },
      ];

      setKPIs(dashboardKPIs);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Industrial</h1>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Atualizar
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{kpi.icon}</span>
              {kpi.trend !== undefined && (
                <span className={`text-sm ${kpi.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend >= 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}%
                </span>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{kpi.title}</h3>
            <p className="text-2xl font-bold text-gray-900">
              {kpi.value}
              {kpi.unit && <span className="text-sm font-normal text-gray-500 ml-1">{kpi.unit}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-left">
            <div className="font-medium">Novo Produto Industrial</div>
            <div className="text-sm text-gray-600">Cadastrar novo produto</div>
          </button>
          <button className="px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-left">
            <div className="font-medium">Estudo de Tempos</div>
            <div className="text-sm text-gray-600">Registrar medição de tempo</div>
          </button>
          <button className="px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-left">
            <div className="font-medium">Capacidade</div>
            <div className="text-sm text-gray-600">Gerenciar capacidade produtiva</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Atividade Recente</h2>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            <span>Sistema atualizado com sucesso</span>
            <span className="ml-auto text-gray-400">Agora</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            <span>Novo processo configurado</span>
            <span className="ml-auto text-gray-400">2 horas atrás</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
            <span>Manutenção agendada</span>
            <span className="ml-auto text-gray-400">5 horas atrás</span>
          </div>
        </div>
      </div>
    </div>
  );
}
