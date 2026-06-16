import { useState, useEffect } from 'react';
import { industrialService, Supplier } from '@/services/industrial.service';

interface Supplier360Props {
  supplierId: string;
}

export function Supplier360({ supplierId }: Supplier360Props) {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSupplierData();
  }, [supplierId]);

  const loadSupplierData = async () => {
    try {
      setLoading(true);
      const supplierData = await industrialService.getSupplierById(supplierId);
      setSupplier(supplierData.data);
    } catch (error) {
      console.error('Error loading supplier data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando dados do fornecedor...</div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Fornecedor não encontrado</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{supplier.nome}</h1>
            <p className="text-gray-600 mt-1">{supplier.descricao}</p>
            <div className="flex items-center gap-2 mt-3">
              {supplier.categoria && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {supplier.categoria.toUpperCase()}
                </span>
              )}
              {supplier.status && (
                <span className={`px-3 py-1 rounded-full text-sm ${
                  supplier.status === 'ativo' ? 'bg-green-100 text-green-800' :
                  supplier.status === 'inativo' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {supplier.status.toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Editar
          </button>
        </div>
      </div>

      {/* Supplier Details */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalhes do Fornecedor</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">CNPJ</h3>
            <p className="text-lg font-semibold text-gray-900">{supplier.cnpj || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Categoria</h3>
            <p className="text-lg font-semibold text-gray-900">{supplier.categoria || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
            <p className="text-lg font-semibold text-gray-900">{supplier.status || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Email</h4>
              <p className="text-lg font-semibold text-gray-900">{supplier.email || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Telefone</h4>
              <p className="text-lg font-semibold text-gray-900">{supplier.telefone || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Rua</h4>
              <p className="text-lg font-semibold text-gray-900">{supplier.endereco || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Número</h4>
              <p className="text-lg font-semibold text-gray-900">{supplier.numero || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Bairro</h4>
              <p className="text-lg font-semibold text-gray-900">{supplier.bairro || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Cidade</h4>
              <p className="text-lg font-semibold text-gray-900">{supplier.cidade || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Estado</h4>
              <p className="text-lg font-semibold text-gray-900">{supplier.estado || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">CEP</h4>
              <p className="text-lg font-semibold text-gray-900">{supplier.cep || 'N/A'}</p>
            </div>
          </div>
        </div>

        {supplier.observacoes && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Observações</h3>
            <p className="text-gray-900">{supplier.observacoes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
