/**
 * Cache Service Tests
 * 
 * Testes unitários para o CacheService.
 */

import { CacheService } from './cache.service';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService();
  });

  describe('set', () => {
    it('deve definir valor no cache', async () => {
      await cacheService.set('test-key', { data: 'value' });
      const result = await cacheService.get('test-key');
      expect(result).toEqual({ data: 'value' });
    });

    it('deve definir valor com TTL customizado', async () => {
      await cacheService.set('test-key', { data: 'value' }, { ttl: 1 });
      const result = await cacheService.get('test-key');
      expect(result).toEqual({ data: 'value' });
    });

    it('deve usar prefixo customizado', async () => {
      await cacheService.set('key', 'value', { prefix: 'custom' });
      const result = await cacheService.get('key', { prefix: 'custom' });
      expect(result).toBe('value');
    });
  });

  describe('get', () => {
    it('deve buscar valor do cache', async () => {
      await cacheService.set('test-key', 'test-value');
      const result = await cacheService.get('test-key');
      expect(result).toBe('test-value');
    });

    it('deve retornar null para chave inexistente', async () => {
      const result = await cacheService.get('non-existent');
      expect(result).toBeNull();
    });

    it('deve retornar null para valor expirado', async () => {
      await cacheService.set('test-key', 'value', { ttl: 0.1 });
      await new Promise(resolve => setTimeout(resolve, 150));
      const result = await cacheService.get('test-key');
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('deve remover valor do cache', async () => {
      await cacheService.set('test-key', 'value');
      await cacheService.delete('test-key');
      const result = await cacheService.get('test-key');
      expect(result).toBeNull();
    });
  });

  describe('deleteByPrefix', () => {
    it('deve remover valores por prefixo', async () => {
      await cacheService.set('key1', 'value1', { prefix: 'test' });
      await cacheService.set('key2', 'value2', { prefix: 'test' });
      await cacheService.set('key3', 'value3', { prefix: 'other' });

      await cacheService.deleteByPrefix('test');

      expect(await cacheService.get('key1', { prefix: 'test' })).toBeNull();
      expect(await cacheService.get('key2', { prefix: 'test' })).toBeNull();
      expect(await cacheService.get('key3', { prefix: 'other' })).toBe('value3');
    });
  });

  describe('clear', () => {
    it('deve limpar todo o cache', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');
      
      await cacheService.clear();
      
      expect(await cacheService.get('key1')).toBeNull();
      expect(await cacheService.get('key2')).toBeNull();
    });
  });

  describe('exists', () => {
    it('deve verificar se chave existe', async () => {
      await cacheService.set('test-key', 'value');
      expect(await cacheService.exists('test-key')).toBe(true);
      expect(await cacheService.exists('non-existent')).toBe(false);
    });
  });

  describe('setMultiple', () => {
    it('deve definir múltiplos valores', async () => {
      await cacheService.setMultiple({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });

      expect(await cacheService.get('key1')).toBe('value1');
      expect(await cacheService.get('key2')).toBe('value2');
      expect(await cacheService.get('key3')).toBe('value3');
    });
  });

  describe('getMultiple', () => {
    it('deve buscar múltiplos valores', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');
      await cacheService.set('key3', 'value3');

      const results = await cacheService.getMultiple(['key1', 'key2', 'key3']);

      expect(results).toEqual({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });
    });
  });

  describe('cleanup', () => {
    it('deve remover valores expirados', async () => {
      await cacheService.set('key1', 'value1', { ttl: 0.1 });
      await cacheService.set('key2', 'value2', { ttl: 1000 });

      await new Promise(resolve => setTimeout(resolve, 150));
      await cacheService.cleanup();

      expect(await cacheService.get('key1')).toBeNull();
      expect(await cacheService.get('key2')).toBe('value2');
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas do cache', async () => {
      await cacheService.set('key1', 'value1', { ttl: 0.1 });
      await cacheService.set('key2', 'value2', { ttl: 1000 });

      const stats = await cacheService.getStats();

      expect(stats.size).toBe(2);
      expect(stats.expired).toBeGreaterThanOrEqual(0);
      expect(stats.valid).toBeGreaterThanOrEqual(0);
    });
  });
});
