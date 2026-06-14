import { BOMRepository, BOM } from '../repositories/bom.repository';
import { CreateBOMDTO, UpdateBOMDTO, BOMResponseDTO } from '../dto/bom.dto';

export class BOMService {
  private repository: BOMRepository;

  constructor() {
    this.repository = new BOMRepository();
  }

  async create(dto: CreateBOMDTO): Promise<BOMResponseDTO> {
    const bom = await this.repository.create(dto);
    return this.toResponseDTO(bom);
  }

  async findById(id: string): Promise<BOMResponseDTO | null> {
    const bom = await this.repository.findById(id);
    if (!bom) return null;
    return this.toResponseDTO(bom);
  }

  async findAll(): Promise<BOMResponseDTO[]> {
    const boms = await this.repository.findAll();
    return boms.map(b => this.toResponseDTO(b));
  }

  async update(id: string, dto: UpdateBOMDTO): Promise<BOMResponseDTO> {
    const bom = await this.repository.update(id, dto);
    return this.toResponseDTO(bom);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByProduct(produtoId: string): Promise<BOMResponseDTO[]> {
    const boms = await this.repository.findByProduct(produtoId);
    return boms.map(b => this.toResponseDTO(b));
  }

  async findByComponent(componenteId: string): Promise<BOMResponseDTO[]> {
    const boms = await this.repository.findByComponent(componenteId);
    return boms.map(b => this.toResponseDTO(b));
  }

  async getBOMTree(produtoId: string): Promise<BOMResponseDTO[]> {
    const boms = await this.repository.findBOMTree(produtoId);
    return boms.map(b => this.toResponseDTO(b));
  }

  private toResponseDTO(bom: BOM): BOMResponseDTO {
    return {
      id: bom.id,
      produto_id: bom.produto_id,
      componente_id: bom.componente_id,
      quantidade: bom.quantidade,
      unidade_medida: bom.unidade_medida,
      sequencia: bom.sequencia,
      observacoes: bom.observacoes,
      created_at: bom.created_at,
      updated_at: bom.updated_at,
      deleted_at: bom.deleted_at,
    };
  }
}
