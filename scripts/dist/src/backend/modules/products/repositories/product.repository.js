/**
 * Product Repository
 *
 * Repository para operações de database relacionadas a produtos.
 */
import { BaseRepository } from '../../../shared/infrastructure/repository/base.repository';
export class ProductRepository extends BaseRepository {
    constructor() {
        super('produtos', 'commerce');
    }
    /**
     * Busca produtos por categoria
     *
     * @param category Categoria
     * @param options Opções de busca
     * @returns Lista de produtos
     */
    async findByCategory(category, options) {
        return this.findAll({
            ...options,
            filters: { categoria: category, ...options?.filters },
        });
    }
    /**
     * Busca produtos ativos
     *
     * @param options Opções de busca
     * @returns Lista de produtos ativos
     */
    async findActive(options) {
        return this.findAll({
            ...options,
            filters: { ativo: true, ...options?.filters },
        });
    }
    /**
     * Busca produtos com baixo estoque
     *
     * @param options Opções de busca
     * @returns Lista de produtos com baixo estoque
     */
    async findLowStock(options) {
        const { data, error } = await this.executeQuery(supabase
            .from(this.tableName)
            .select('*')
            .lt('estoque', supabase.raw('estoque_minimo'))
            .is('deleted_at', null));
        if (error)
            throw error;
        return data;
    }
    /**
     * Busca produtos em promoção
     *
     * @param options Opções de busca
     * @returns Lista de produtos em promoção
     */
    async findOnPromotion(options) {
        const { data, error } = await this.executeQuery(supabase
            .from(this.tableName)
            .select('*')
            .not('preco_promocional', 'is', null)
            .is('deleted_at', null));
        if (error)
            throw error;
        return data;
    }
    /**
     * Busca produtos por tags
     *
     * @param tags Tags para buscar
     * @param options Opções de busca
     * @returns Lista de produtos
     */
    async findByTags(tags, options) {
        const { data, error } = await this.executeQuery(supabase
            .from(this.tableName)
            .select('*')
            .contains('tags', tags)
            .is('deleted_at', null));
        if (error)
            throw error;
        return data;
    }
    /**
     * Busca produto por código
     *
     * @param code Código do produto
     * @returns Produto ou null
     */
    async findByCode(code) {
        return this.findOne({ codigo: code });
    }
    /**
     * Atualiza estoque de produto
     *
     * @param id ID do produto
     * @param quantity Quantidade a adicionar/subtrair
     * @returns Produto atualizado
     */
    async updateStock(id, quantity) {
        const product = await this.findById(id);
        if (!product)
            throw new Error('Product not found');
        const newStock = Math.max(0, product.estoque + quantity);
        return this.update(id, { estoque: newStock });
    }
    /**
     * Ativa produto
     *
     * @param id ID do produto
     * @returns Produto atualizado
     */
    async activate(id) {
        return this.update(id, { ativo: true });
    }
    /**
     * Desativa produto
     *
     * @param id ID do produto
     * @returns Produto atualizado
     */
    async deactivate(id) {
        return this.update(id, { ativo: false });
    }
    /**
     * Define preço promocional
     *
     * @param id ID do produto
     * @param promotionalPrice Preço promocional
     * @returns Produto atualizado
     */
    async setPromotionalPrice(id, promotionalPrice) {
        return this.update(id, { preco_promocional: promotionalPrice });
    }
    /**
     * Remove preço promocional
     *
     * @param id ID do produto
     * @returns Produto atualizado
     */
    async removePromotionalPrice(id) {
        return this.update(id, { preco_promocional: null });
    }
    /**
     * Busca produtos com paginação
     *
     * @param options Opções de busca e paginação
     * @returns Resultado paginado
     */
    async findPaginated(options) {
        return super.findPaginated(options);
    }
}
