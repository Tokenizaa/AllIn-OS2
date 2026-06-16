import { useState, useEffect } from 'react';
import { industrialService, Process, ProcessStep, ProcessDocument } from '@/services/industrial.service';

interface Process360Props {
  processId: string;
}

export function Process360({ processId }: Process360Props) {
  const [process, setProcess] = useState<Process | null>(null);
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [documents, setDocuments] = useState<ProcessDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'documents'>('overview');

  useEffect(() => {
    loadProcessData();
  }, [processId]);

  const loadProcessData = async () => {
    try {
      setLoading(true);
      
      const [processData, stepsData, documentsData] = await Promise.all([
        industrialService.getProcessById(processId),
        industrialService.getProcessStepsByProcessId(processId),
        industrialService.getProcessDocumentsByProcessId(processId),
      ]);

      setProcess(processData.data);
      setSteps(stepsData.data || []);
      setDocuments(documentsData.data || []);
    } catch (error) {
      console.error('Error loading process data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando dados do processo...</div>
      </div>
    );
  }

  if (!process) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Processo não encontrado</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{process.nome}</h1>
            <p className="text-gray-600 mt-1">{process.descricao}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {process.tipo_processo || 'PROCESSO'}
              </span>
              {process.status && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {process.status.toUpperCase()}
                </span>
              )}
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
            { id: 'steps', label: 'Etapas' },
            { id: 'documents', label: 'Documentos' },
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
                  {process.capacidade_unidades_hora || 'N/A'} unidades/hora
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tempo Padrão</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {process.tempo_padrao_unidade_segundos || 'N/A'} segundos/unidade
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Eficiência</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {process.eficiencia_padrao || 'N/A'}%
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Setup</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {process.setup_time_minutos || 'N/A'} minutos
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Lote Mínimo</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {process.lote_minimo || 'N/A'} unidades
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Lote Máximo</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {process.lote_maximo || 'N/A'} unidades
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Perda Prevista</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {process.perda_prevista_percentual || 'N/A'}%
                </p>
              </div>
            </div>

            {process.observacoes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Observações</h3>
                <p className="text-gray-900">{process.observacoes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="space-y-4">
            {steps.length === 0 ? (
              <p className="text-gray-500">Nenhuma etapa configurada</p>
            ) : (
              steps.map((step, index) => (
                <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold">
                      {step.sequencia}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{step.nome}</h4>
                      <p className="text-sm text-gray-600 mt-1">{step.descricao}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Tempo: {step.tempo_padrao_minutos || 'N/A'} min</span>
                        <span>Capacidade: {step.capacidade_unidades_hora || 'N/A'} unid/h</span>
                        {step.status && <span>Status: {step.status}</span>}
                      </div>
                    </div>
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
                        {document.categoria && <span>Categoria: {document.categoria}</span>}
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
      </div>
    </div>
  );
}
