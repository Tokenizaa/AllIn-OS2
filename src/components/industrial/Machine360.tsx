import { useState, useEffect } from 'react';
import { industrialService, Machine, MachineMaintenance, MachineDocument, MachinePhoto } from '@/services/industrial.service';

interface Machine360Props {
  machineId: string;
}

export function Machine360({ machineId }: Machine360Props) {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [maintenances, setMaintenances] = useState<MachineMaintenance[]>([]);
  const [documents, setDocuments] = useState<MachineDocument[]>([]);
  const [photos, setPhotos] = useState<MachinePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'maintenance' | 'documents' | 'photos'>('overview');

  useEffect(() => {
    loadMachineData();
  }, [machineId]);

  const loadMachineData = async () => {
    try {
      setLoading(true);
      
      const [machineData, maintenanceData, documentData, photoData] = await Promise.all([
        industrialService.getMachineById(machineId),
        industrialService.getMachineMaintenancesByMachineId(machineId),
        industrialService.getMachineDocumentsByMachineId(machineId),
        industrialService.getMachinePhotosByMachineId(machineId),
      ]);

      setMachine(machineData.data);
      setMaintenances(maintenanceData.data || []);
      setDocuments(documentData.data || []);
      setPhotos(photoData.data || []);
    } catch (error) {
      console.error('Error loading machine data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando dados da máquina...</div>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Máquina não encontrada</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{machine.nome}</h1>
            <p className="text-gray-600 mt-1">{machine.descricao}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className={`px-3 py-1 rounded-full text-sm ${
                machine.status === 'ativa' ? 'bg-green-100 text-green-800' :
                machine.status === 'manutencao' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {machine.status?.toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {machine.tipo}
              </span>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Editar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Visão Geral' },
            { id: 'maintenance', label: 'Manutenção' },
            { id: 'documents', label: 'Documentos' },
            { id: 'photos', label: 'Fotos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Capacidade</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {machine.capacidade_teorica || 'N/A'} {machine.unidade_medida || ''}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Fabricante</h3>
                <p className="text-lg font-semibold text-gray-900">{machine.fabricante || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Modelo</h3>
                <p className="text-lg font-semibold text-gray-900">{machine.modelo || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Ano Fabricação</h3>
                <p className="text-lg font-semibold text-gray-900">{machine.ano_fabricacao || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Vida Útil</h3>
                <p className="text-lg font-semibold text-gray-900">{machine.vida_util_anos || 'N/A'} anos</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Localização</h3>
                <p className="text-lg font-semibold text-gray-900">{machine.localizacao || 'N/A'}</p>
              </div>
            </div>

            {machine.observacoes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Observações</h3>
                <p className="text-gray-900">{machine.observacoes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            {maintenances.length === 0 ? (
              <p className="text-gray-500">Nenhuma manutenção registrada</p>
            ) : (
              maintenances.map((maintenance) => (
                <div key={maintenance.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{maintenance.tipo}</h4>
                      <p className="text-sm text-gray-600 mt-1">{maintenance.descricao}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Data: {new Date(maintenance.data_agendada).toLocaleDateString()}</span>
                        <span>Status: {maintenance.status}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      maintenance.status === 'concluida' ? 'bg-green-100 text-green-800' :
                      maintenance.status === 'agendada' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {maintenance.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            {documents.length === 0 ? (
              <p className="text-gray-500">Nenhum documento disponível</p>
            ) : (
              documents.map((document) => (
                <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{document.titulo}</h4>
                      <p className="text-sm text-gray-600 mt-1">{document.descricao}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Tipo: {document.tipo}</span>
                        {document.versao && <span>Versão: {document.versao}</span>}
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                      Visualizar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.length === 0 ? (
              <p className="text-gray-500 col-span-full">Nenhuma foto disponível</p>
            ) : (
              photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={photo.url_foto}
                    alt={photo.titulo || 'Foto da máquina'}
                    className="w-full h-full object-cover"
                  />
                  {photo.titulo && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2">
                      {photo.titulo}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
