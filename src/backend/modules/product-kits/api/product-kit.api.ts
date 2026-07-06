import { ProductKitService } from "../services/product-kit.service";
import { CreateProductKitDto, UpdateProductKitDto } from "../dto/product-kit.dto";

export class ProductKitAPI {
  private service: ProductKitService;

  constructor() {
    this.service = new ProductKitService();
  }

  /**
   * POST /api/product-kits
   * Criar novo kit de produtos
   */
  async create(body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as CreateProductKitDto;
      const productKit = await this.service.create(dto);
      return { data: productKit, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error creating product kit:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/product-kits/:id
   * Buscar kit de produtos por ID
   */
  async findById(id: string): Promise<{ data: any; error: string | null }> {
    try {
      const productKit = await this.service.findById(id);
      if (!productKit) {
        return { data: null, error: 'Product kit not found' };
      }
      return { data: productKit, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error finding product kit:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/product-kits/slug/:slug
   * Buscar kit de produtos por slug
   */
  async findBySlug(slug: string): Promise<{ data: any; error: string | null }> {
    try {
      const productKit = await this.service.findBySlug(slug);
      if (!productKit) {
        return { data: null, error: 'Product kit not found' };
      }
      return { data: productKit, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error finding product kit by slug:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/product-kits
   * Buscar todos os kits de produtos
   */
  async findAll(): Promise<{ data: any; error: string | null }> {
    try {
      const productKits = await this.service.findAll();
      return { data: productKits, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error finding product kits:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/product-kits/active
   * Buscar kits de produtos ativos
   */
  async findActive(): Promise<{ data: any; error: string | null }> {
    try {
      const productKits = await this.service.findActive();
      return { data: productKits, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error finding active product kits:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/product-kits/featured
   * Buscar kits de produtos em destaque
   */
  async findFeatured(): Promise<{ data: any; error: string | null }> {
    try {
      const productKits = await this.service.findFeatured();
      return { data: productKits, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error finding featured product kits:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/product-kits/in-stock
   * Buscar kits de produtos em estoque
   */
  async findInStock(): Promise<{ data: any; error: string | null }> {
    try {
      const productKits = await this.service.findInStock();
      return { data: productKits, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error finding in-stock product kits:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * PUT /api/product-kits/:id
   * Atualizar kit de produtos
   */
  async update(id: string, body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as UpdateProductKitDto;
      const productKit = await this.service.update(id, dto);
      return { data: productKit, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error updating product kit:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * DELETE /api/product-kits/:id
   * Deletar kit de produtos
   */
  async delete(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.delete(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error deleting product kit:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/product-kits/:id/stock
   * Atualizar estoque do kit de produtos
   */
  async updateStock(id: string, quantity: number): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.updateStock(id, quantity);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error updating stock:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/product-kits/:id/decrement-stock
   * Decrementar estoque do kit de produtos
   */
  async decrementStock(id: string, quantity: number): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.decrementStock(id, quantity);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error decrementing stock:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/product-kits/:id/increment-stock
   * Incrementar estoque do kit de produtos
   */
  async incrementStock(id: string, quantity: number): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.incrementStock(id, quantity);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error incrementing stock:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/product-kits/:id/activate
   * Ativar kit de produtos
   */
  async activate(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.activate(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error activating product kit:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/product-kits/:id/deactivate
   * Desativar kit de produtos
   */
  async deactivate(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.deactivate(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error deactivating product kit:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/product-kits/:id/featured
   * Definir kit de produtos como destaque
   */
  async setFeatured(id: string, featured: boolean): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.setFeatured(id, featured);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ProductKitAPI] Error setting featured:', error);
      return { data: null, error: (error as Error).message };
    }
  }
}
