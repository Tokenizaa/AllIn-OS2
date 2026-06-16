import { useState, useEffect } from 'react';
import { industrialService, ProductIndustrial } from '@/services/industrial.service';

interface Product360Props {
  productId: string;
}

export function Product360({ productId }: Product360Props) {
  const [product, setProduct] = useState<ProductIndustrial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductData();
  }, [productId]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      const productData = await industrialService.getProductIndustrialById(productId);
      setProduct(productData.data);
    } catch (error) {
      console.error('Error loading product data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando dados do produto...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Produto não encontrado</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.modelo}</h1>
            <p className="text-gray-600 mt-1">{product.descricao}</p>
            <div className="flex items-center gap-2 mt-3">
              {product.categoria && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {product.categoria.toUpperCase()}
                </span>
              )}
              {product.linha && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {product.linha}
                </span>
              )}
              {product.colecao && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {product.colecao}
                </span>
              )}
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Editar
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalhes do Produto</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Categoria</h3>
            <p className="text-lg font-semibold text-gray-900">{product.categoria || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Subcategoria</h3>
            <p className="text-lg font-semibold text-gray-900">{product.subcategoria || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Linha</h3>
            <p className="text-lg font-semibold text-gray-900">{product.linha || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Coleção</h3>
            <p className="text-lg font-semibold text-gray-900">{product.colecao || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensões</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Comprimento</h4>
              <p className="text-lg font-semibold text-gray-900">{product.comprimento_cm || 'N/A'} cm</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Largura</h4>
              <p className="text-lg font-semibold text-gray-900">{product.largura_cm || 'N/A'} cm</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Altura</h4>
              <p className="text-lg font-semibold text-gray-900">{product.altura_cm || 'N/A'} cm</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificações Técnicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Densidade</h4>
              <p className="text-lg font-semibold text-gray-900">{product.densidade_kg_m3 || 'N/A'} kg/m³</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Tipo de Espuma</h4>
              <p className="text-lg font-semibold text-gray-900">{product.tipo_espuma || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Número de Camadas</h4>
              <p className="text-lg font-semibold text-gray-900">{product.numero_camadas || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Firmeza</h4>
              <p className="text-lg font-semibold text-gray-900">{product.firmeza || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Peso</h4>
              <p className="text-lg font-semibold text-gray-900">{product.peso_kg || 'N/A'} kg</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Garantia</h4>
              <p className="text-lg font-semibold text-gray-900">{product.garantia_meses || 'N/A'} meses</p>
            </div>
          </div>
        </div>

        {product.composicao && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Composição</h3>
            <p className="text-gray-900">{product.composicao}</p>
          </div>
        )}

        {product.observacoes_tecnicas && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Observações Técnicas</h3>
            <p className="text-gray-900">{product.observacoes_tecnicas}</p>
          </div>
        )}

        {product.normas_tecnicas && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Normas Técnicas</h3>
            <p className="text-gray-900">{product.normas_tecnicas}</p>
          </div>
        )}

        {product.certificacoes && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificações</h3>
            <p className="text-gray-900">{product.certificacoes}</p>
          </div>
        )}

        {product.observacoes && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Observações</h3>
            <p className="text-gray-900">{product.observacoes}</p>
          </div>
        )}

        {product.especificacoes && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Especificações Adicionais</h3>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(product.especificacoes, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
