import { OptionService, ProductOptionValueService } from "../services/option.service";
import { CreateOptionDto, UpdateOptionDto, CreateProductOptionValueDto } from "../dto/option.dto";

export class OptionAPI {
  private service: OptionService;

  constructor() {
    this.service = new OptionService();
  }

  /**
   * POST /api/options
   * Criar nova opção
   */
  async create(body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as CreateOptionDto;
      const option = await this.service.create(dto);
      return { data: option, error: null };
    } catch (error) {
      console.error('[OptionAPI] Error creating option:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/options/:id
   * Buscar opção por ID
   */
  async findById(id: string): Promise<{ data: any; error: string | null }> {
    try {
      const option = await this.service.findById(id);
      if (!option) {
        return { data: null, error: 'Option not found' };
      }
      return { data: option, error: null };
    } catch (error) {
      console.error('[OptionAPI] Error finding option:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/options/slug/:slug
   * Buscar opção por slug
   */
  async findBySlug(slug: string): Promise<{ data: any; error: string | null }> {
    try {
      const option = await this.service.findBySlug(slug);
      if (!option) {
        return { data: null, error: 'Option not found' };
      }
      return { data: option, error: null };
    } catch (error) {
      console.error('[OptionAPI] Error finding option by slug:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/options
   * Buscar todas as opções
   */
  async findAll(): Promise<{ data: any; error: string | null }> {
    try {
      const options = await this.service.findAll();
      return { data: options, error: null };
    } catch (error) {
      console.error('[OptionAPI] Error finding options:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/options/type/:type
   * Buscar opções por tipo
   */
  async findByType(type: string): Promise<{ data: any; error: string | null }> {
    try {
      const options = await this.service.findByType(type);
      return { data: options, error: null };
    } catch (error) {
      console.error('[OptionAPI] Error finding options by type:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/options/required
   * Buscar opções obrigatórias
   */
  async findRequired(): Promise<{ data: any; error: string | null }> {
    try {
      const options = await this.service.findRequired();
      return { data: options, error: null };
    } catch (error) {
      console.error('[OptionAPI] Error finding required options:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * PUT /api/options/:id
   * Atualizar opção
   */
  async update(id: string, body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as UpdateOptionDto;
      const option = await this.service.update(id, dto);
      return { data: option, error: null };
    } catch (error) {
      console.error('[OptionAPI] Error updating option:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * DELETE /api/options/:id
   * Deletar opção
   */
  async delete(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.delete(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[OptionAPI] Error deleting option:', error);
      return { data: null, error: (error as Error).message };
    }
  }
}

export class ProductOptionValueAPI {
  private service: ProductOptionValueService;

  constructor() {
    this.service = new ProductOptionValueService();
  }

  /**
   * POST /api/product-option-values
   * Criar novo valor de opção de produto
   */
  async create(body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as CreateProductOptionValueDto;
      const value = await this.service.create(dto);
      return { data: value, error: null };
    } catch (error) {
      console.error('[ProductOptionValueAPI] Error creating option value:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/product-option-values/:id
   * Buscar valor de opção por ID
   */
  async findById(id: string): Promise<{ data: any; error: string | null }> {
    try {
      const value = await this.service.findById(id);
      if (!value) {
        return { data: null, error: 'Option value not found' };
      }
      return { data: value, error: null };
    } catch (error) {
      console.error('[ProductOptionValueAPI] Error finding option value:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/product-option-values/product/:productId
   * Buscar valores de opção por produto
   */
  async findByProductId(productId: string): Promise<{ data: any; error: string | null }> {
    try {
      const values = await this.service.findByProductId(productId);
      return { data: values, error: null };
    } catch (error) {
      console.error('[ProductOptionValueAPI] Error finding option values by product:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/product-option-values/option/:optionId
   * Buscar valores de opção por opção
   */
  async findByOptionId(optionId: string): Promise<{ data: any; error: string | null }> {
    try {
      const values = await this.service.findByOptionId(optionId);
      return { data: values, error: null };
    } catch (error) {
      console.error('[ProductOptionValueAPI] Error finding option values by option:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * DELETE /api/product-option-values/:id
   * Deletar valor de opção
   */
  async delete(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.delete(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ProductOptionValueAPI] Error deleting option value:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * DELETE /api/product-option-values/product/:productId
   * Deletar valores de opção por produto
   */
  async deleteByProductId(productId: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.deleteByProductId(productId);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ProductOptionValueAPI] Error deleting option values by product:', error);
      return { data: null, error: (error as Error).message };
    }
  }
}
