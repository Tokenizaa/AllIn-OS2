import { AttributeService, ProductAttributeValueService } from "../services/attribute.service";
import { CreateAttributeDto, UpdateAttributeDto, CreateProductAttributeValueDto, UpdateProductAttributeValueDto } from "../dto/attribute.dto";

export class AttributeAPI {
  private service: AttributeService;

  constructor() {
    this.service = new AttributeService();
  }

  /**
   * POST /api/attributes
   * Criar novo atributo
   */
  async create(body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as CreateAttributeDto;
      const attribute = await this.service.create(dto);
      return { data: attribute, error: null };
    } catch (error) {
      console.error('[AttributeAPI] Error creating attribute:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/attributes/:id
   * Buscar atributo por ID
   */
  async findById(id: string): Promise<{ data: any; error: string | null }> {
    try {
      const attribute = await this.service.findById(id);
      if (!attribute) {
        return { data: null, error: 'Attribute not found' };
      }
      return { data: attribute, error: null };
    } catch (error) {
      console.error('[AttributeAPI] Error finding attribute:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/attributes/slug/:slug
   * Buscar atributo por slug
   */
  async findBySlug(slug: string): Promise<{ data: any; error: string | null }> {
    try {
      const attribute = await this.service.findBySlug(slug);
      if (!attribute) {
        return { data: null, error: 'Attribute not found' };
      }
      return { data: attribute, error: null };
    } catch (error) {
      console.error('[AttributeAPI] Error finding attribute by slug:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/attributes
   * Buscar todos os atributos
   */
  async findAll(): Promise<{ data: any; error: string | null }> {
    try {
      const attributes = await this.service.findAll();
      return { data: attributes, error: null };
    } catch (error) {
      console.error('[AttributeAPI] Error finding attributes:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/attributes/type/:type
   * Buscar atributos por tipo
   */
  async findByType(type: string): Promise<{ data: any; error: string | null }> {
    try {
      const attributes = await this.service.findByType(type);
      return { data: attributes, error: null };
    } catch (error) {
      console.error('[AttributeAPI] Error finding attributes by type:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/attributes/filterable
   * Buscar atributos filtráveis
   */
  async findFilterable(): Promise<{ data: any; error: string | null }> {
    try {
      const attributes = await this.service.findFilterable();
      return { data: attributes, error: null };
    } catch (error) {
      console.error('[AttributeAPI] Error finding filterable attributes:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/attributes/searchable
   * Buscar atributos pesquisáveis
   */
  async findSearchable(): Promise<{ data: any; error: string | null }> {
    try {
      const attributes = await this.service.findSearchable();
      return { data: attributes, error: null };
    } catch (error) {
      console.error('[AttributeAPI] Error finding searchable attributes:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/attributes/required
   * Buscar atributos obrigatórios
   */
  async findRequired(): Promise<{ data: any; error: string | null }> {
    try {
      const attributes = await this.service.findRequired();
      return { data: attributes, error: null };
    } catch (error) {
      console.error('[AttributeAPI] Error finding required attributes:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * PUT /api/attributes/:id
   * Atualizar atributo
   */
  async update(id: string, body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as UpdateAttributeDto;
      const attribute = await this.service.update(id, dto);
      return { data: attribute, error: null };
    } catch (error) {
      console.error('[AttributeAPI] Error updating attribute:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * DELETE /api/attributes/:id
   * Deletar atributo
   */
  async delete(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.delete(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[AttributeAPI] Error deleting attribute:', error);
      return { data: null, error: (error as Error).message };
    }
  }
}

export class ProductAttributeValueAPI {
  private service: ProductAttributeValueService;

  constructor() {
    this.service = new ProductAttributeValueService();
  }

  /**
   * POST /api/product-attribute-values
   * Criar novo valor de atributo de produto
   */
  async create(body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as CreateProductAttributeValueDto;
      const value = await this.service.create(dto);
      return { data: value, error: null };
    } catch (error) {
      console.error('[ProductAttributeValueAPI] Error creating attribute value:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/product-attribute-values/:id
   * Buscar valor de atributo por ID
   */
  async findById(id: string): Promise<{ data: any; error: string | null }> {
    try {
      const value = await this.service.findById(id);
      if (!value) {
        return { data: null, error: 'Attribute value not found' };
      }
      return { data: value, error: null };
    } catch (error) {
      console.error('[ProductAttributeValueAPI] Error finding attribute value:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/product-attribute-values/product/:productId
   * Buscar valores de atributo por produto
   */
  async findByProductId(productId: string): Promise<{ data: any; error: string | null }> {
    try {
      const values = await this.service.findByProductId(productId);
      return { data: values, error: null };
    } catch (error) {
      console.error('[ProductAttributeValueAPI] Error finding attribute values by product:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * GET /api/product-attribute-values/attribute/:attributeId
   * Buscar valores de atributo por atributo
   */
  async findByAttributeId(attributeId: string): Promise<{ data: any; error: string | null }> {
    try {
      const values = await this.service.findByAttributeId(attributeId);
      return { data: values, error: null };
    } catch (error) {
      console.error('[ProductAttributeValueAPI] Error finding attribute values by attribute:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * PUT /api/product-attribute-values/:id
   * Atualizar valor de atributo
   */
  async update(id: string, body: any): Promise<{ data: any; error: string | null }> {
    try {
      const dto = body as UpdateProductAttributeValueDto;
      const value = await this.service.update(id, dto);
      return { data: value, error: null };
    } catch (error) {
      console.error('[ProductAttributeValueAPI] Error updating attribute value:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * DELETE /api/product-attribute-values/:id
   * Deletar valor de atributo
   */
  async delete(id: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.delete(id);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ProductAttributeValueAPI] Error deleting attribute value:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * POST /api/product-attribute-values/upsert
   * Criar ou atualizar valor de atributo
   */
  async upsert(productId: string, attributeId: string, value: any): Promise<{ data: any; error: string | null }> {
    try {
      const attributeValue = await this.service.upsert(productId, attributeId, value);
      return { data: attributeValue, error: null };
    } catch (error) {
      console.error('[ProductAttributeValueAPI] Error upserting attribute value:', error);
      return { data: null, error: (error as Error).message };
    }
  }

  /**
   * DELETE /api/product-attribute-values/product/:productId
   * Deletar valores de atributo por produto
   */
  async deleteByProductId(productId: string): Promise<{ data: any; error: string | null }> {
    try {
      await this.service.deleteByProductId(productId);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('[ProductAttributeValueAPI] Error deleting attribute values by product:', error);
      return { data: null, error: (error as Error).message };
    }
  }
}
