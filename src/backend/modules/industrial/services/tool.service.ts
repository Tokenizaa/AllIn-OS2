import { ToolRepository, Tool } from '../repositories/tool.repository';
import { CreateToolDTO, UpdateToolDTO, ToolResponseDTO } from '../dto/tool.dto';

export class ToolService {
  private repository: ToolRepository;

  constructor() {
    this.repository = new ToolRepository();
  }

  async create(dto: CreateToolDTO): Promise<ToolResponseDTO> {
    const tool = await this.repository.create(dto);
    return this.toResponseDTO(tool);
  }

  async findById(id: string): Promise<ToolResponseDTO | null> {
    const tool = await this.repository.findById(id);
    if (!tool) return null;
    return this.toResponseDTO(tool);
  }

  async findAll(): Promise<ToolResponseDTO[]> {
    const tools = await this.repository.findAll();
    return tools.map(t => this.toResponseDTO(t));
  }

  async update(id: string, dto: UpdateToolDTO): Promise<ToolResponseDTO> {
    const tool = await this.repository.update(id, dto);
    return this.toResponseDTO(tool);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCategory(categoria: string): Promise<ToolResponseDTO[]> {
    const tools = await this.repository.findByCategory(categoria);
    return tools.map(t => this.toResponseDTO(t));
  }

  async findByLocation(locationId: string): Promise<ToolResponseDTO[]> {
    const tools = await this.repository.findByLocation(locationId);
    return tools.map(t => this.toResponseDTO(t));
  }

  async findByResponsavel(responsavelId: string): Promise<ToolResponseDTO[]> {
    const tools = await this.repository.findByResponsavel(responsavelId);
    return tools.map(t => this.toResponseDTO(t));
  }

  async findAvailable(): Promise<ToolResponseDTO[]> {
    const tools = await this.repository.findAvailable();
    return tools.map(t => this.toResponseDTO(t));
  }

  async assign(id: string, responsavelId: string): Promise<ToolResponseDTO> {
    return this.update(id, { responsavel_id: responsavelId, status: 'in_use' });
  }

  async release(id: string): Promise<ToolResponseDTO> {
    return this.update(id, { responsavel_id: null, status: 'available' });
  }

  private toResponseDTO(tool: Tool): ToolResponseDTO {
    return {
      id: tool.id,
      descricao: tool.descricao,
      categoria: tool.categoria,
      localizacao_id: tool.localizacao_id,
      responsavel_id: tool.responsavel_id,
      status: tool.status,
      observacoes: tool.observacoes,
      created_at: tool.created_at,
      updated_at: tool.updated_at,
      deleted_at: tool.deleted_at,
    };
  }
}
