import { useState, useEffect } from 'react';
import { industrialService, Material } from '@/services/industrial.service';

interface Material360Props {
  materialId: string;
}

export function Material360({ materialId }: Material360Props) {
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaterialData();
  }, [materialId]);

  const loadMaterialData = async () => {
    try {
      setLoading(true);
      const materialData = await industrialService.getMaterialById(materialId);
      setMaterial(materialData.data);
    } catch (error) {
      console.error('Error loading material data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando dados do material...</div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Material não encontrado</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{material.nome}</h1>
            <p className="text-gray-600 mt-1">{material.descricao}</p>
            <div className="flex items-center gap-2 mt-3">
              {material.categoria && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {material.categoria.toUpperCase()}
                </span>
              )}
              {material.tipo && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {material.tipo}
                </span>
              )}
              {material.status && (
                <span className={`px-3 py-1 rounded-full text-sm ${
                  material.status === 'ativo' ? 'bg-green-100 text-green-800' :
                  material.status === 'inativo' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {material.status.toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Editar
          </button>
        </div>
      </div>

      {/* Material Details */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalhes do Material</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Código</h3>
            <p className="text-lg font-semibold text-gray-900">{material.codigo || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Categoria</h3>
            <p className="text-lg font-semibold text-gray-900">{material.categoria || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Tipo</h3>
            <p className="text-lg font-semibold text-gray-900">{material.tipo || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Unidade de Medida</h3>
            <p className="text-lg font-semibold text-gray-900">{material.unidade_medida || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
            <p className="text-lg font-semibold text-gray-900">{material.status || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Fornecedor</h3>
            <p className="text-lg font-semibold text-gray-900">{material.fornecedor_id || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificações</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Densidade</h4>
              <p className="text-lg font-semibold text-gray-900">{material.densidade || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Cor</h4>
              <p className="text-lg font-semibold text-gray-900">{material.cor || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Peso Unitário</h4>
              <p className="text-lg font-semibold text-gray-900">{material.peso_unitario || 'N/A'} kg</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Dimensões</h4>
              <p className="text-lg font-semibold text-gray-900">{material.dimensoes || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estoque</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Quantidade Atual</h4>
              <p className="text-lg font-semibold text-gray-900">{material.quantidade_atual || 'N/A'} {material.unidade_medida || ''}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Quantidade Mínima</h4>
              <p className="text-lg font-semibold text-gray-900">{material.quantidade_minima || 'N/A'} {material.unidade_medida || ''}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Custo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Custo Unitário</h4>
              <p className="text-lg font-semibold text-gray-900">R$ {material.custo_unitario || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Custo Total</h4>
              <p className="text-lg font-semibold text-gray-900">R$ {material.custo_total || 'N/A'}</p>
            </div>
          </div>
        </div>

        {material.observacoes && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Observações</h3>
            <p className="text-gray-900">{material.observacoes}</p>
          </div>
        )}

        {material.especificacoes && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Especificações Adicionais</h3>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(material.especificacoes, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
