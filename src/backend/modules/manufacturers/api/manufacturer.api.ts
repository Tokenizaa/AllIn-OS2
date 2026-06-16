import { ManufacturerService } from "../services/manufacturer.service";
import { CreateManufacturerDto, UpdateManufacturerDto } from "../dto/manufacturer.dto";

export class ManufacturerAPI {
  private service: ManufacturerService;

  constructor() {
    this.service = new ManufacturerService();
  }

  /**
   * POST /api/manufacturers
   * Criar novo fabricante
   */
  async create(body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as CreateManufacturerDto;
      const manufacturer = await this.service.create(dto);
      return { data: manufacturer, error: null };
    } catch (error) {
      console.error('[ManufacturerAPI] Error creating manufacturer:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/manufacturers/:id
   * Buscar fabricante por ID
   */
  async findById(id: string): Promise<{ data: any; error: string | null }> {
    try {
      const manufacturer = await this.service.findById(id);
      if (!manufacturer) {
        return { data: null, error: 'Manufacturer not found' };
      }
      return { data: manufacturer, error: null };
    } catch (error) {
      console.error('[ManufacturerAPI] Error finding manufacturer:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/manufacturers/slug/:slug
   * Buscar fabricante por slug
   */
  async findBySlug(slug: string): Promise<{ data: any; error: string | null }> {
    try {
      const manufacturer = await this.service.findBySlug(slug);
      if (!manufacturer) {
        return { data: null, error: 'Manufacturer not found' };
      }
      return { data: manufacturer, error: null };
    } catch (error) {
      console.error('[ManufacturerAPI] Error finding manufacturer by slug:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/manufacturers
   * Buscar todos os fabricantes
   */
  async findAll(): Promise<{ data: any; error: string | null }> {
    try {
      const manufacturers = await this.service.findAll();
      return { data: manufacturers, error: null };
    } catch (error) {
      console.error('[ManufacturerAPI] Error finding manufacturers:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/manufacturers/active
   * Buscar fabricantes ativos
   */
  async findActive(): Promise<{ data: any; error: string | null }> {
    try {
      const manufacturers = await this.service.findActive();
      return { data: manufacturers, error: null };
    } catch (error) {
      console.error('[ManufacturerAPI] Error finding active manufacturers:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/manufacturers/featured
   * Buscar fabricantes em destaque
   */
  async findFeatured(): Promise<{ data: any; error: string | null }> {
    try {
      const manufacturers = await this.service.findFeatured();
      return { data: manufacturers, error: null };
    } catch (error) {
      console.error('[ManufacturerAPI] Error finding featured manufacturers:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/manufacturers/country/:country
   * Buscar fabricantes por país
   */
  async findByCountry(country: string): Promise<{ data: any; error: string | null }> {
    try {
      const manufacturers = await this.service.findByCountry(country);
      return { data: manufacturers, error: null };
    } catch (error) {
      console.error('[ManufacturerAPI] Error finding manufacturers by country:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * PUT /api/manufacturers/:id
   * Atualizar fabricante
   */
  async update(id: string, body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as UpdateManufacturerDto;
      const manufacturer = await this.service.update(id, dto);
      return { data: manufacturer, error: null };
    } catch (error) {
      console.error('[ManufacturerAPI] Error updating manufacturer:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * DELETE /api/manufacturers/:id
   * Deletar fabricante
   */
  async delete(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.delete(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ManufacturerAPI] Error deleting manufacturer:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/manufacturers/:id/activate
   * Ativar fabricante
   */
  async activate(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.activate(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ManufacturerAPI] Error activating manufacturer:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/manufacturers/:id/deactivate
   * Desativar fabricante
   */
  async deactivate(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.deactivate(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ManufacturerAPI] Error deactivating manufacturer:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/manufacturers/:id/featured
   * Definir fabricante como destaque
   */
  async setFeatured(id: string, featured: boolean): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.setFeatured(id, featured);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ManufacturerAPI] Error setting featured:', error);
      return { data: null, error: (error as Error).message };
    }
  }
}
