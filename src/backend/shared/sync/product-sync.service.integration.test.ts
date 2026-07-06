/**
 * Integration Tests para ProductSyncService
 * 
 * NOTA: Este arquivo contém exemplos de testes de integração para o ProductSyncService.
 * Para executar estes testes, você precisará instalar vitest e configurar um ambiente de teste:
 * npm install -D vitest @vitest/ui supertest
 * 
 * Exemplo de configuração no package.json:
 * "scripts": {
 *   "test:integration": "vitest --config vitest.integration.config.ts"
 * }
 * 
 * Estrutura esperada dos testes de integração:
 * 
 * import { describe, it, expect, beforeAll, afterAll } from 'vitest';
 * import { ProductSyncService } from './product-sync.service';
 * import { AllInService } from '../allin/allin.service';
 * import { ProductRepository } from '../../modules/products/repositories/product.repository';
 * 
 * describe('ProductSyncService Integration Tests', () => {
 *   let syncService: ProductSyncService;
 *   let allInService: AllInService;
 *   let productRepository: ProductRepository;
 * 
 *   beforeAll(async () => {
 *     // Configurar ambiente de teste
 *     allInService = new AllInService();
 *     productRepository = new ProductRepository();
 *     syncService = new ProductSyncService(allInService, productRepository);
 *   });
 * 
 *   afterAll(async () => {
 *     // Limpar ambiente de teste
 *     await productRepository.deleteAll();
 *   });
 * 
 *   describe('syncProducts', () => {
 *     it('deve sincronizar produtos da API Allin', async () => {
 *       const result = await syncService.syncProducts();
 * 
 *       expect(result.success).toBe(true);
 *       expect(result.totalProcessed).toBeGreaterThan(0);
 *       expect(result.errors).toHaveLength(0);
 *     });
 * 
 *     it('deve criar novos produtos que não existem localmente', async () => {
 *       const allinProducts = await allInService.getProdutos();
 *       const firstProduct = allinProducts[0];
 * 
 *       // Verificar se o produto foi criado
 *       const localProduct = await productRepository.findByAllinId(firstProduct.id);
 *       expect(localProduct).toBeDefined();
 *       expect(localProduct?.name).toBe(firstProduct.nome);
 *     });
 * 
 *     it('deve atualizar produtos que já existem localmente', async () => {
 *       // Executar sync duas vezes
 *       await syncService.syncProducts();
 *       const result = await syncService.syncProducts();
 * 
 *       expect(result.success).toBe(true);
 *       expect(result.updated).toBeGreaterThan(0);
 *     });
 *   });
 * 
 *   describe('syncProduct', () => {
 *     it('deve sincronizar um produto específico', async () => {
 *       const allinProducts = await allInService.getProdutos();
 *       const firstProduct = allinProducts[0];
 * 
 *       const result = await syncService.syncProduct(firstProduct.id);
 * 
 *       expect(result.success).toBe(true);
 *       expect(result.productId).toBeDefined();
 *     });
 * 
 *     it('deve lançar erro se o produto não existir na API Allin', async () => {
 *       const result = await syncService.syncProduct(999999);
 * 
 *       expect(result.success).toBe(false);
 *       expect(result.error).toBeDefined();
 *     });
 *   });
 * 
 *   describe('error handling', () => {
 *     it('deve lidar com erros da API Allin', async () => {
 *       // Mock para simular erro da API
 *       vi.spyOn(allInService, 'getProdutos').mockRejectedValue(new Error('API Error'));
 * 
 *       const result = await syncService.syncProducts();
 * 
 *       expect(result.success).toBe(false);
 *       expect(result.errors).toHaveLength(1);
 *     });
 * 
 *     it('deve continuar sync mesmo se um produto falhar', async () => {
 *       // Mock para simular erro em um produto específico
 *       vi.spyOn(allInService, 'getProduto').mockRejectedValueOnce(new Error('API Error'));
 * 
 *       const result = await syncService.syncProducts();
 * 
 *       expect(result.success).toBe(true);
 *       expect(result.errors).toHaveLength(1);
 *       expect(result.totalProcessed).toBeGreaterThan(1);
 *     });
 *   });
 * });
 */
