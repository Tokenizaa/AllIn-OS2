import { ComponentRepository, Component } from '../repositories/component.repository';
import { CreateComponentDTO, UpdateComponentDTO, ComponentResponseDTO } from '../dto/component.dto';

export class ComponentService {
  private repository: ComponentRepository;

  constructor() {
    this.repository = new ComponentRepository();
  }

  async create(dto: CreateComponentDTO): Promise<ComponentResponseDTO> {
    const component = await this.repository.create(dto);
    return this.toResponseDTO(component);
  }

  async findById(id: string): Promise<ComponentResponseDTO | null> {
    const component = await this.repository.findById(id);
    if (!component) return null;
    return this.toResponseDTO(component);
  }

  async findAll(): Promise<ComponentResponseDTO[]> {
    const components = await this.repository.findAll();
    return components.map(c => this.toResponseDTO(c));
  }

  async update(id: string, dto: UpdateComponentDTO): Promise<ComponentResponseDTO> {
    const component = await this.repository.update(id, dto);
    return this.toResponseDTO(component);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCategory(categoria: string): Promise<ComponentResponseDTO[]> {
    const components = await this.repository.findByCategory(categoria);
    return components.map(c => this.toResponseDTO(c));
  }

  async findActive(): Promise<ComponentResponseDTO[]> {
    const components = await this.repository.findActive();
    return components.map(c => this.toResponseDTO(c));
  }

  private toResponseDTO(component: Component): ComponentResponseDTO {
    return {
      id: component.id,
      nome: component.nome,
      categoria: component.categoria,
      especificacoes: component.especificacoes,
      observacoes: component.observacoes,
      created_at: component.created_at,
      updated_at: component.updated_at,
      deleted_at: component.deleted_at,
    };
  }
}
