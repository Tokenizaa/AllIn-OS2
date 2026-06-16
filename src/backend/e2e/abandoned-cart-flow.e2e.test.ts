/**
 * E2E Tests para Fluxo de Carrinhos Abandonados
 * 
 * NOTA: Este arquivo contém exemplos de testes E2E para o fluxo de carrinhos abandonados.
 * Para executar estes testes, você precisará instalar Playwright e configurar um ambiente de teste:
 * npm install -D @playwright/test
 * 
 * Exemplo de configuração no package.json:
 * "scripts": {
 *   "test:e2e": "playwright test"
 * }
 * 
 * Estrutura esperada dos testes E2E:
 * 
 * import { test, expect } from '@playwright/test';
 * import { AbandonedCartService } from '../modules/abandoned-carts/services/abandoned-cart.service';
 * import { OrderService } from '../modules/orders/services/order.service';
 * 
 * test.describe('Fluxo de Carrinhos Abandonados - E2E', () => {
 *   test('deve detectar carrinho abandonado e enviar email de recuperação', async () => {
 *     const abandonedCartService = new AbandonedCartService();
 * 
 *     // Criar carrinho abandonado
 *     const cart = await abandonedCartService.create({
 *       customer_id: 'customer-123',
 *       customer_email: 'test@example.com',
 *       customer_name: 'Test User',
 *       items: [
 *         {
 *           product_id: 'product-1',
 *           product_name: 'Test Product',
 *           quantity: 1,
 *           price: 100,
 *         },
 *       ],
 *       total_amount: 100,
 *     });
 * 
 *     // Enviar email de recuperação
 *     await abandonedCartService.sendRecoveryEmail(cart.id);
 * 
 *     // Verificar que email foi marcado como enviado
 *     const updatedCart = await abandonedCartService.findById(cart.id);
 *     expect(updatedCart?.recovery_email_sent).toBe(true);
 *     expect(updatedCart?.recovery_email_sent_at).toBeDefined();
 *   });
 * 
 *   test('deve marcar carrinho como recuperado quando cliente completa pedido', async () => {
 *     const abandonedCartService = new AbandonedCartService();
 *     const orderService = new OrderService();
 * 
 *     // Criar carrinho abandonado
 *     const cart = await abandonedCartService.create({
 *       customer_id: 'customer-123',
 *       customer_email: 'test@example.com',
 *       customer_name: 'Test User',
 *       items: [
 *         {
 *           product_id: 'product-1',
 *           product_name: 'Test Product',
 *           quantity: 1,
 *           price: 100,
 *         },
 *       ],
 *       total_amount: 100,
 *     });
 * 
 *     // Cliente completa pedido
 *     const order = await orderService.create({
 *       customer_id: 'customer-123',
 *       items: cart.items,
 *       total_amount: cart.total_amount,
 *     });
 * 
 *     // Marcar carrinho como recuperado
 *     await abandonedCartService.markAsRecovered(cart.id, order.id);
 * 
 *     // Verificar que carrinho foi marcado como recuperado
 *     const updatedCart = await abandonedCartService.findById(cart.id);
 *     expect(updatedCart?.recovered).toBe(true);
 *     expect(updatedCart?.recovered_order_id).toBe(order.id);
 *   });
 * 
 *   test('deve enviar emails em massa para carrinhos não recuperados', async () => {
 *     const abandonedCartService = new AbandonedCartService();
 * 
 *     // Criar múltiplos carrinhos abandonados
 *     for (let i = 0; i < 5; i++) {
 *       await abandonedCartService.create({
 *         customer_id: `customer-${i}`,
 *         customer_email: `test${i}@example.com`,
 *         customer_name: `Test User ${i}`,
 *         items: [
 *           {
 *             product_id: 'product-1',
 *             product_name: 'Test Product',
 *             quantity: 1,
 *             price: 100,
 *           },
 *         ],
 *         total_amount: 100,
 *       });
 *     }
 * 
 *     // Enviar emails em massa
 *     const sentCount = await abandonedCartService.sendBulkRecoveryEmails(10);
 * 
 *     expect(sentCount).toBe(5);
 *   });
 * 
 *   test('deve calcular estatísticas de recuperação corretamente', async () => {
 *     const abandonedCartService = new AbandonedCartService();
 * 
 *     // Criar carrinhos com diferentes estados
 *     const cart1 = await abandonedCartService.create({
 *       customer_id: 'customer-1',
 *       customer_email: 'test1@example.com',
 *       customer_name: 'Test User 1',
 *       items: [],
 *       total_amount: 100,
 *     });
 * 
 *     const cart2 = await abandonedCartService.create({
 *       customer_id: 'customer-2',
 *       customer_email: 'test2@example.com',
 *       customer_name: 'Test User 2',
 *       items: [],
 *       total_amount: 200,
 *     });
 * 
 *     // Marcar um como recuperado
 *     await abandonedCartService.markAsRecovered(cart1.id, 'order-123');
 * 
 *     // Obter estatísticas
 *     const stats = await abandonedCartService.getStats();
 * 
 *     expect(stats.total_abandoned).toBe(2);
 *     expect(stats.total_recovered).toBe(1);
 *     expect(stats.recovery_rate).toBe(50);
 *   });
 * });
 */
