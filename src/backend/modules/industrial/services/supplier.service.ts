import { SupplierRepository, Supplier } from '../repositories/supplier.repository';
import { CreateSupplierDTO, UpdateSupplierDTO, SupplierResponseDTO } from '../dto/supplier.dto';

export class SupplierService {
  private repository: SupplierRepository;

  constructor() {
    this.repository = new SupplierRepository();
  }

  async create(dto: CreateSupplierDTO): Promise<SupplierResponseDTO> {
    const supplier = await this.repository.create(dto);
    return this.toResponseDTO(supplier);
  }

  async findById(id: string): Promise<SupplierResponseDTO | null> {
    const supplier = await this.repository.findById(id);
    if (!supplier) return null;
    return this.toResponseDTO(supplier);
  }

  async findAll(): Promise<SupplierResponseDTO[]> {
    const suppliers = await this.repository.findAll();
    return suppliers.map(s => this.toResponseDTO(s));
  }

  async update(id: string, dto: UpdateSupplierDTO): Promise<SupplierResponseDTO> {
    const supplier = await this.repository.update(id, dto);
    return this.toResponseDTO(supplier);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByStatus(status: string): Promise<SupplierResponseDTO[]> {
    const suppliers = await this.repository.findByStatus(status);
    return suppliers.map(s => this.toResponseDTO(s));
  }

  async findActive(): Promise<SupplierResponseDTO[]> {
    const suppliers = await this.repository.findActive();
    return suppliers.map(s => this.toResponseDTO(s));
  }

  async activate(id: string): Promise<SupplierResponseDTO> {
    return this.update(id, { status: 'active' });
  }

  async deactivate(id: string): Promise<SupplierResponseDTO> {
    return this.update(id, { status: 'inactive' });
  }

  private toResponseDTO(supplier: Supplier): SupplierResponseDTO {
    return {
      id: supplier.id,
      razao_social: supplier.razao_social,
      nome_fantasia: supplier.nome_fantasia,
      cnpj: supplier.cnpj,
      contato_nome: supplier.contato_nome,
      contato_email: supplier.contato_email,
      contato_telefone: supplier.contato_telefone,
      endereco: supplier.endereco,
      cidade: supplier.cidade,
      estado: supplier.estado,
      cep: supplier.cep,
      status: supplier.status,
      condicoes_pagamento: supplier.condicoes_pagamento,
      prazo_entrega_padrao: supplier.prazo_entrega_padrao,
      observacoes: supplier.observacoes,
      created_at: supplier.created_at,
      updated_at: supplier.updated_at,
      deleted_at: supplier.deleted_at,
    };
  }
}
