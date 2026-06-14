import { MaterialRepository, Material } from '../repositories/material.repository';
import { CreateMaterialDTO, UpdateMaterialDTO, MaterialResponseDTO } from '../dto/material.dto';

export class MaterialService {
  private repository: MaterialRepository;

  constructor() {
    this.repository = new MaterialRepository();
  }

  async create(dto: CreateMaterialDTO): Promise<MaterialResponseDTO> {
    const material = await this.repository.create(dto);
    return this.toResponseDTO(material);
  }

  async findById(id: string): Promise<MaterialResponseDTO | null> {
    const material = await this.repository.findById(id);
    if (!material) return null;
    return this.toResponseDTO(material);
  }

  async findAll(): Promise<MaterialResponseDTO[]> {
    const materials = await this.repository.findAll();
    return materials.map(m => this.toResponseDTO(m));
  }

  async update(id: string, dto: UpdateMaterialDTO): Promise<MaterialResponseDTO> {
    const material = await this.repository.update(id, dto);
    return this.toResponseDTO(material);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCategory(categoria: string): Promise<MaterialResponseDTO[]> {
    const materials = await this.repository.findByCategory(categoria);
    return materials.map(m => this.toResponseDTO(m));
  }

  async findBySupplier(supplierId: string): Promise<MaterialResponseDTO[]> {
    const materials = await this.repository.findBySupplier(supplierId);
    return materials.map(m => this.toResponseDTO(m));
  }

  async findLowStock(): Promise<MaterialResponseDTO[]> {
    const materials = await this.repository.findLowStock();
    return materials.map(m => this.toResponseDTO(m));
  }

  async adjustStock(id: string, quantidade: number): Promise<MaterialResponseDTO> {
    const material = await this.repository.updateStock(id, quantidade);
    return this.toResponseDTO(material);
  }

  private toResponseDTO(material: Material): MaterialResponseDTO {
    return {
      id: material.id,
      codigo: material.codigo,
      descricao: material.descricao,
      categoria: material.categoria,
      unidade_medida: material.unidade_medida,
      estoque_atual: material.estoque_atual,
      estoque_minimo: material.estoque_minimo,
      estoque_maximo: material.estoque_maximo,
      custo_unitario: material.custo_unitario,
      custo_medio: material.custo_medio,
      fornecedor_padrao_id: material.fornecedor_padrao_id,
      localizacao_id: material.localizacao_id,
      especificacoes: material.especificacoes,
      observacoes: material.observacoes,
      created_at: material.created_at,
      updated_at: material.updated_at,
      deleted_at: material.deleted_at,
    };
  }
}
