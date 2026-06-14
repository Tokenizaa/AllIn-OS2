import { ProductIndustrialRepository, ProductIndustrial } from '../repositories/product-industrial.repository';
import { CreateProductIndustrialDTO, UpdateProductIndustrialDTO, ProductIndustrialResponseDTO } from '../dto/product-industrial.dto';

export class ProductIndustrialService {
  private repository: ProductIndustrialRepository;

  constructor() {
    this.repository = new ProductIndustrialRepository();
  }

  async create(dto: CreateProductIndustrialDTO): Promise<ProductIndustrialResponseDTO> {
    const product = await this.repository.create(dto);
    return this.toResponseDTO(product);
  }

  async findById(id: string): Promise<ProductIndustrialResponseDTO | null> {
    const product = await this.repository.findById(id);
    if (!product) return null;
    return this.toResponseDTO(product);
  }

  async findAll(): Promise<ProductIndustrialResponseDTO[]> {
    const products = await this.repository.findAll();
    return products.map(p => this.toResponseDTO(p));
  }

  async update(id: string, dto: UpdateProductIndustrialDTO): Promise<ProductIndustrialResponseDTO> {
    const product = await this.repository.update(id, dto);
    return this.toResponseDTO(product);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCategory(categoria: string): Promise<ProductIndustrialResponseDTO[]> {
    const products = await this.repository.findByCategory(categoria);
    return products.map(p => this.toResponseDTO(p));
  }

  async findByDimensions(largura: number, comprimento: number): Promise<ProductIndustrialResponseDTO[]> {
    const products = await this.repository.findByDimensions(largura, comprimento);
    return products.map(p => this.toResponseDTO(p));
  }

  async findActive(): Promise<ProductIndustrialResponseDTO[]> {
    const products = await this.repository.findActive();
    return products.map(p => this.toResponseDTO(p));
  }

  private toResponseDTO(product: ProductIndustrial): ProductIndustrialResponseDTO {
    return {
      id: product.id,
      modelo: product.modelo,
      categoria: product.categoria,
      largura_cm: product.largura_cm,
      comprimento_cm: product.comprimento_cm,
      altura_cm: product.altura_cm,
      especificacoes: product.especificacoes,
      observacoes: product.observacoes,
      created_at: product.created_at,
      updated_at: product.updated_at,
      deleted_at: product.deleted_at,
    };
  }
}
