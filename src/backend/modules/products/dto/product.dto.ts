/**
 * Product DTOs
 * 
 * DTOs para operações com produtos.
 */

export interface CreateProductDTO {
  nome: string;
  codigo: string;
  descricao: string;
  categoria: string;
  preco: number;
  preco_promocional?: number;
  estoque: number;
  estoque_minimo: number;
  unidade_medida: string;
  imagem_url?: string;
  ativo?: boolean;
  tags?: string[];
  metadados?: any;
}

export interface UpdateProductDTO {
  nome?: string;
  codigo?: string;
  descricao?: string;
  categoria?: string;
  preco?: number;
  preco_promocional?: number;
  estoque?: number;
  estoque_minimo?: number;
  unidade_medida?: string;
  imagem_url?: string;
  ativo?: boolean;
  tags?: string[];
  metadados?: any;
}

export interface ProductResponseDTO {
  id: string;
  nome: string;
  codigo: string;
  descricao: string;
  categoria: string;
  preco: number;
  preco_promocional?: number;
  estoque: number;
  estoque_minimo: number;
  unidade_medida: string;
  imagem_url?: string;
  ativo: boolean;
  tags?: string[];
  metadados?: any;
  created_at: Date;
  updated_at: Date;
}

export interface ProductListResponseDTO {
  data: ProductResponseDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
