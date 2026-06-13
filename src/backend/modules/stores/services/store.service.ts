/**
 * Store Service
 * 
 * Service para gerenciar lojas virtuais.
 */

import { StoreRepository } from '../repositories/store.repository';
import {
  Store,
  CreateStoreDTO,
  UpdateStoreDTO,
  StoreResponseDTO,
  StoreStats,
} from '../dto/store.dto';

export class StoreService {
  private repository: StoreRepository;

  constructor() {
    this.repository = new StoreRepository();
  }

  /**
   * Cria nova loja
   */
  async create(dto: CreateStoreDTO): Promise<Store> {
    // Verifica se o slug já existe
    const existingBySlug = await this.repository.findBySlug(dto.slug);
    if (existingBySlug.length > 0) {
      throw new Error('Slug already in use');
    }

    // Verifica se o store_id já existe
    const existingByStoreId = await this.repository.findByStoreId(dto.store_id);
    if (existingByStoreId.length > 0) {
      throw new Error('Store ID already in use');
    }

    return this.repository.create({
      ...dto,
      active: dto.active ?? true,
    });
  }

  /**
   * Busca loja por ID
   */
  async findById(id: string): Promise<Store | null> {
    return this.repository.findById(id);
  }

  /**
   * Busca loja por slug
   */
  async findBySlug(slug: string): Promise<Store | null> {
    const stores = await this.repository.findBySlug(slug);
    return stores[0] || null;
  }

  /**
   * Busca loja por store_id
   */
  async findByStoreId(storeId: number): Promise<Store | null> {
    const stores = await this.repository.findByStoreId(storeId);
    return stores[0] || null;
  }

  /**
   * Busca todas as lojas
   */
  async findAll(activeOnly: boolean = true): Promise<Store[]> {
    if (activeOnly) {
      return this.repository.findActive();
    }
    return this.repository.findAll();
  }

  /**
   * Atualiza loja
   */
  async update(id: string, dto: UpdateStoreDTO): Promise<Store> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error('Store not found');
    }

    // Verifica se o novo slug já existe (se estiver sendo alterado)
    if (dto.slug && dto.slug !== existing.slug) {
      const existingBySlug = await this.repository.findBySlug(dto.slug);
      if (existingBySlug.length > 0) {
        throw new Error('Slug already in use');
      }
    }

    return this.repository.update(id, dto);
  }

  /**
   * Deleta loja
   */
  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error('Store not found');
    }

    await this.repository.delete(id);
  }

  /**
   * Ativa loja
   */
  async activate(id: string): Promise<Store> {
    return this.repository.activate(id);
  }

  /**
   * Desativa loja
   */
  async deactivate(id: string): Promise<Store> {
    return this.repository.deactivate(id);
  }

  /**
   * Busca estatísticas
   */
  async getStats(): Promise<StoreStats> {
    return this.repository.getStats();
  }

  /**
   * Converte para DTO de resposta
   */
  toResponseDTO(store: Store): StoreResponseDTO {
    return {
      id: store.id,
      name: store.name,
      slug: store.slug,
      description: store.description,
      logo: store.logo,
      banner: store.banner,
      theme: store.theme,
      settings: store.settings,
      contact: store.contact,
      social: store.social,
      seo: store.seo,
      active: store.active,
      store_id: store.store_id,
      created_at: store.created_at,
      updated_at: store.updated_at,
    };
  }
}
