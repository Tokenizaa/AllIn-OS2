import { LocationRepository, Location } from '../repositories/location.repository';
import { CreateLocationDTO, UpdateLocationDTO, LocationResponseDTO } from '../dto/location.dto';

export class LocationService {
  private repository: LocationRepository;

  constructor() {
    this.repository = new LocationRepository();
  }

  async create(dto: CreateLocationDTO): Promise<LocationResponseDTO> {
    const location = await this.repository.create(dto);
    return this.toResponseDTO(location);
  }

  async findById(id: string): Promise<LocationResponseDTO | null> {
    const location = await this.repository.findById(id);
    if (!location) return null;
    return this.toResponseDTO(location);
  }

  async findAll(): Promise<LocationResponseDTO[]> {
    const locations = await this.repository.findAll();
    return locations.map(l => this.toResponseDTO(l));
  }

  async update(id: string, dto: UpdateLocationDTO): Promise<LocationResponseDTO> {
    const location = await this.repository.update(id, dto);
    return this.toResponseDTO(location);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByType(tipo: string): Promise<LocationResponseDTO[]> {
    const locations = await this.repository.findByType(tipo);
    return locations.map(l => this.toResponseDTO(l));
  }

  async findByParent(parentId: string): Promise<LocationResponseDTO[]> {
    const locations = await this.repository.findByParent(parentId);
    return locations.map(l => this.toResponseDTO(l));
  }

  async findTree(): Promise<LocationResponseDTO[]> {
    const locations = await this.repository.findTree();
    return locations.map(l => this.toResponseDTO(l));
  }

  private toResponseDTO(location: Location): LocationResponseDTO {
    return {
      id: location.id,
      nome: location.nome,
      tipo: location.tipo,
      parent_id: location.parent_id,
      descricao: location.descricao,
      area_m2: location.area_m2,
      created_at: location.created_at,
      updated_at: location.updated_at,
      deleted_at: location.deleted_at,
    };
  }
}
