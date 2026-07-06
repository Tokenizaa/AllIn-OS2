/**
 * Product Sync Service
 *
 * Serviço para sync de produtos da API Allin.
 */
import { BaseSyncService } from './base-sync.service';
import { allinService } from '../allin/allin.service';
import { ProductMapper } from './mappers/product.mapper';
import { ProductRepository } from '../../modules/products/repositories/product.repository';
export class ProductSyncService extends BaseSyncService {
    productRepository;
    constructor(config) {
        super(config);
        this.productRepository = new ProductRepository();
    }
    /**
     * Obtém nome da entidade
     */
    getEntityName() {
        return 'products';
    }
    /**
     * Mapeia dados da API Allin para entidade local
     */
    mapFromAllin(data) {
        return ProductMapper.fromAllin(data);
    }
    /**
     * Executa sync de produtos
     */
    async sync(params) {
        const result = this.createSyncResult();
        try {
            console.log('[ProductSync] Starting sync...');
            // Busca produtos da API Allin
            const allinProducts = await this.executeWithRetry(() => allinService.getProdutos(), 'Fetch products from AllIn');
            console.log(`[ProductSync] Fetched ${allinProducts.length} products from AllIn`);
            // Converte para formato local
            const localProducts = ProductMapper.fromAllinArray(allinProducts);
            // Processa todos os produtos
            await this.processAllBatches(localProducts, async (product) => await this.processProduct(product, params), result);
            console.log(`[ProductSync] Sync completed: ${result.processedRecords} processed, ${result.failedRecords} failed`);
        }
        catch (error) {
            this.addError(result, undefined, 'Sync failed', error);
            console.error('[ProductSync] Sync failed:', error);
        }
        return this.finalizeSyncResult(result);
    }
    /**
     * Processa um produto individual
     */
    async processProduct(product, params) {
        try {
            // Verifica se produto já existe localmente pelo código (sku)
            const existing = product.sku ? await this.productRepository.findByCode(product.sku) : null;
            if (existing) {
                // Atualiza produto existente
                // Verifica se precisa de sync (para sync incremental)
                if (params?.incremental && params.since) {
                    // Para sync incremental, verificar se o produto foi modificado desde o último sync
                    // Como não temos timestamp de modificação na API Allin, usamos o threshold do mapper
                    const syncThreshold = 5 * 60 * 1000; // 5 minutos
                    const timeSinceLastSync = Date.now() - product.allin_synced_at.getTime();
                    if (timeSinceLastSync < syncThreshold) {
                        // Não precisa de sync, skip
                        return;
                    }
                }
                await this.productRepository.update(existing.id, {
                    nome: product.nome || existing.nome,
                    codigo: product.sku || existing.codigo,
                    descricao: product.descricao || existing.descricao,
                    categoria: product.categoria_id || existing.categoria,
                    preco: product.preco || existing.preco,
                    estoque: product.quantidade ?? existing.estoque,
                    ativo: product.status === 'active' || existing.ativo,
                    metadados: {
                        ...existing.metadados,
                        allin_id: product.allin_id,
                        allin_synced_at: product.allin_synced_at,
                    },
                });
                console.log(`[ProductSync] Updated product ${product.allin_id}`);
            }
            else {
                // Cria novo produto
                await this.productRepository.create({
                    nome: product.nome || 'Produto sem nome',
                    codigo: product.sku || product.allin_id,
                    descricao: product.descricao || '',
                    categoria: product.categoria_id || 'Geral',
                    preco: product.preco || 0,
                    estoque: product.quantidade || 0,
                    estoque_minimo: 10,
                    unidade_medida: 'un',
                    ativo: product.status === 'active',
                    metadados: {
                        allin_id: product.allin_id,
                        allin_synced_at: product.allin_synced_at,
                    },
                });
                console.log(`[ProductSync] Created product ${product.allin_id}`);
            }
        }
        catch (error) {
            console.error(`[ProductSync] Failed to process product ${product.allin_id}:`, error);
            throw error;
        }
    }
    /**
     * Sync incremental de produtos
     */
    async syncIncremental(since) {
        return this.sync({ incremental: true, since });
    }
}
