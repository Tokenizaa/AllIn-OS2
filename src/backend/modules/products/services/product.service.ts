/**
 * Product Service
 * 
 * Service para gerenciar produtos.
 */

import { ProductRepository, Product } from '../repositories/product.repository';
import { CreateProductDTO, UpdateProductDTO, ProductResponseDTO } from '../dto/product.dto';

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  /**
   * Cria novo produto
   * 
   * @param dto DTO de criação
   * @returns Produto criado
   */
  async create(dto: CreateProductDTO): Promise<ProductResponseDTO> {
    const product = await this.repository.create(dto);
    return this.toResponseDTO(product);
  }

  /**
   * Busca produto por ID
   * 
   * @param id ID do produto
   * @returns Produto
   */
  async findById(id: string): Promise<ProductResponseDTO> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return this.toResponseDTO(product);
  }

  /**
   * Busca todos os produtos
   * 
   * @param filters Filtros opcionais
   * @returns Lista de produtos
   */
  async findAll(filters?: any): Promise<ProductResponseDTO[]> {
    const products = await this.repository.findAll({ filters });
    return products.map(p => this.toResponseDTO(p));
  }

  /**
   * Busca produtos por categoria
   * 
   * @param category Categoria
   * @returns Lista de produtos
   */
  async findByCategory(category: string): Promise<ProductResponseDTO[]> {
    const products = await this.repository.findByCategory(category);
    return products.map(p => this.toResponseDTO(p));
  }

  /**
   * Busca produtos ativos
   * 
   * @returns Lista de produtos ativos
   */
  async findActive(): Promise<ProductResponseDTO[]> {
    const products = await this.repository.findActive();
    return products.map(p => this.toResponseDTO(p));
  }

  /**
   * Busca produtos com baixo estoque
   * 
   * @returns Lista de produtos com baixo estoque
   */
  async findLowStock(): Promise<ProductResponseDTO[]> {
    const products = await this.repository.findLowStock();
    return products.map(p => this.toResponseDTO(p));
  }

  /**
   * Busca produtos em promoção
   * 
   * @returns Lista de produtos em promoção
   */
  async findOnPromotion(): Promise<ProductResponseDTO[]> {
    const products = await this.repository.findOnPromotion();
    return products.map(p => this.toResponseDTO(p));
  }

  /**
   * Atualiza produto
   * 
   * @param id ID do produto
   * @param dto DTO de atualização
   * @returns Produto atualizado
   */
  async update(id: string, dto: UpdateProductDTO): Promise<ProductResponseDTO> {
    const product = await this.repository.update(id, dto);
    return this.toResponseDTO(product);
  }

  /**
   * Remove produto (soft delete)
   * 
   * @param id ID do produto
   */
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Atualiza estoque de produto
   * 
   * @param id ID do produto
   * @param quantity Quantidade a adicionar/subtrair
   * @returns Produto atualizado
   */
  async updateStock(id: string, quantity: number): Promise<ProductResponseDTO> {
    const product = await this.repository.updateStock(id, quantity);
    return this.toResponseDTO(product);
  }

  /**
   * Ativa produto
   * 
   * @param id ID do produto
   * @returns Produto atualizado
   */
  async activate(id: string): Promise<ProductResponseDTO> {
    const product = await this.repository.activate(id);
    return this.toResponseDTO(product);
  }

  /**
   * Desativa produto
   * 
   * @param id ID do produto
   * @returns Produto atualizado
   */
  async deactivate(id: string): Promise<ProductResponseDTO> {
    const product = await this.repository.deactivate(id);
    return this.toResponseDTO(product);
  }

  /**
   * Define preço promocional
   * 
   * @param id ID do produto
   * @param promotionalPrice Preço promocional
   * @returns Produto atualizado
   */
  async setPromotionalPrice(id: string, promotionalPrice: number): Promise<ProductResponseDTO> {
    const product = await this.repository.setPromotionalPrice(id, promotionalPrice);
    return this.toResponseDTO(product);
  }

  /**
   * Remove preço promocional
   * 
   * @param id ID do produto
   * @returns Produto atualizado
   */
  async removePromotionalPrice(id: string): Promise<ProductResponseDTO> {
    const product = await this.repository.removePromotionalPrice(id);
    return this.toResponseDTO(product);
  }

  /**
   * Converte Product para ProductResponseDTO
   * 
   * @param product Produto
   * @returns DTO de resposta
   */
  private toResponseDTO(product: Product): ProductResponseDTO {
    return {
      id: product.id,
      nome: product.nome,
      codigo: product.codigo,
      descricao: product.descricao,
      categoria: product.categoria,
      preco: product.preco,
      preco_promocional: product.preco_promocional,
      estoque: product.estoque,
      estoque_minimo: product.estoque_minimo,
      unidade_medida: product.unidade_medida,
      imagem_url: product.imagem_url,
      ativo: product.ativo,
      tags: product.tags,
      metadados: product.metadados,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }
}
