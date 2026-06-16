/**
 * Unit Tests para AbandonedCartService
 * 
 * NOTA: Este arquivo contém exemplos de testes unitários para o AbandonedCartService.
 * Para executar estes testes, você precisará instalar vitest:
 * npm install -D vitest @vitest/ui
 * 
 * Exemplo de configuração no package.json:
 * "scripts": {
 *   "test": "vitest",
 *   "test:ui": "vitest --ui"
 * }
 * 
 * Estrutura esperada dos testes:
 * 
 * import { describe, it, expect, beforeEach, vi } from 'vitest';
 * import { AbandonedCartService } from './abandoned-cart.service';
 * import { AbandonedCartRepository } from '../repositories/abandoned-cart.repository';
 * 
 * // Mock do repository
 * vi.mock('../repositories/abandoned-cart.repository');
 * 
 * describe('AbandonedCartService', () => {
 *   let service: AbandonedCartService;
 *   let mockRepository: any;
 * 
 *   beforeEach(() => {
 *     mockRepository = {
 *       create: vi.fn(),
 *       findById: vi.fn(),
 *       update: vi.fn(),
 *       delete: vi.fn(),
 *       findByCustomerId: vi.fn(),
 *       findByCustomerEmail: vi.fn(),
 *       findByDateRange: vi.fn(),
 *       findNotRecovered: vi.fn(),
 *       findRecoveryEmailNotSent: vi.fn(),
 *       markAsRecovered: vi.fn(),
 *       markRecoveryEmailSent: vi.fn(),
 *       getStats: vi.fn(),
 *     };
 *     vi.mocked(AbandonedCartRepository).mockImplementation(() => mockRepository);
 *     service = new AbandonedCartService();
 *   });
 * 
 *   describe('create', () => {
 *     it('deve criar um carrinho abandonado com sucesso', async () => {
 *       const dto = {
 *         customer_id: '123',
 *         customer_email: 'test@example.com',
 *         customer_name: 'Test User',
 *         items: [],
 *         total_amount: 100,
 *       };
 * 
 *       const expectedResult = {
 *         id: 'abc-123',
 *         ...dto,
 *         abandoned_at: new Date().toISOString(),
 *         recovery_email_sent: false,
 *         recovered: false,
 *         created_at: new Date().toISOString(),
 *         updated_at: new Date().toISOString(),
 *       };
 * 
 *       mockRepository.create.mockResolvedValue(expectedResult);
 * 
 *       const result = await service.create(dto);
 * 
 *       expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining(dto));
 *       expect(result).toEqual(expectedResult);
 *     });
 *   });
 * 
 *   describe('findById', () => {
 *     it('deve encontrar um carrinho por ID', async () => {
 *       const cartId = 'abc-123';
 *       const expectedResult = {
 *         id: cartId,
 *         customer_id: '123',
 *         customer_email: 'test@example.com',
 *         customer_name: 'Test User',
 *         items: [],
 *         total_amount: 100,
 *         abandoned_at: new Date().toISOString(),
 *         recovery_email_sent: false,
 *         recovered: false,
 *         created_at: new Date().toISOString(),
 *         updated_at: new Date().toISOString(),
 *       };
 * 
 *       mockRepository.findById.mockResolvedValue(expectedResult);
 * 
 *       const result = await service.findById(cartId);
 * 
 *       expect(mockRepository.findById).toHaveBeenCalledWith(cartId);
 *       expect(result).toEqual(expectedResult);
 *     });
 *   });
 * 
 *   describe('getStats', () => {
 *     it('deve retornar estatísticas de carrinhos abandonados', async () => {
 *       const expectedResult = {
 *         total_abandoned: 100,
 *         total_recovered: 30,
 *         recovery_rate: 0.3,
 *         total_revenue_recovered: 3000,
 *         total_revenue_lost: 7000,
 *         average_abandonment_time_hours: 24,
 *       };
 * 
 *       mockRepository.getStats.mockResolvedValue(expectedResult);
 * 
 *       const result = await service.getStats();
 * 
 *       expect(mockRepository.getStats).toHaveBeenCalled();
 *       expect(result).toEqual(expectedResult);
 *     });
 *   });
 * });
 */
