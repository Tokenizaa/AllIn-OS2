/**
 * Cache Service
 * 
 * Service para gerenciar cache usando Redis ou cache em memória.
 */

export interface CacheOptions {
  ttl?: number; // Time to live em segundos
  prefix?: string;
}

export class CacheService {
  private cache: Map<string, { value: any; expiresAt: number }> = new Map();
  private defaultTTL: number = 3600; // 1 hora por padrão

  /**
   * Define valor no cache
   * 
   * @param key Chave do cache
   * @param value Valor a ser cacheado
   * @param options Opções de cache
   */
  async set(key: string, value: any, options: CacheOptions = {}): Promise<void> {
    const ttl = options.ttl || this.defaultTTL;
    const expiresAt = Date.now() + ttl * 1000;
    const prefix = options.prefix || 'default';
    const fullKey = `${prefix}:${key}`;

    this.cache.set(fullKey, { value, expiresAt });
  }

  /**
   * Busca valor do cache
   * 
   * @param key Chave do cache
   * @param options Opções de cache
   * @returns Valor cacheado ou null
   */
  async get(key: string, options: CacheOptions = {}): Promise<any | null> {
    const prefix = options.prefix || 'default';
    const fullKey = `${prefix}:${key}`;

    const cached = this.cache.get(fullKey);

    if (!cached) {
      return null;
    }

    // Verificar se expirou
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(fullKey);
      return null;
    }

    return cached.value;
  }

  /**
   * Remove valor do cache
   * 
   * @param key Chave do cache
   * @param options Opções de cache
   */
  async delete(key: string, options: CacheOptions = {}): Promise<void> {
    const prefix = options.prefix || 'default';
    const fullKey = `${prefix}:${key}`;

    this.cache.delete(fullKey);
  }

  /**
   * Remove todos os valores do cache com um prefixo
   * 
   * @param prefix Prefixo das chaves
   */
  async deleteByPrefix(prefix: string): Promise<void> {
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (key.startsWith(`${prefix}:`)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }

  /**
   * Limpa todo o cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }

  /**
   * Verifica se chave existe no cache
   * 
   * @param key Chave do cache
   * @param options Opções de cache
   * @returns true se existe
   */
  async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    const value = await this.get(key, options);
    return value !== null;
  }

  /**
   * Define múltiplos valores no cache
   * 
   * @param items Items para cachear
   * @param options Opções de cache
   */
  async setMultiple(items: Record<string, any>, options: CacheOptions = {}): Promise<void> {
    const promises = Object.entries(items).map(([key, value]) =>
      this.set(key, value, options)
    );

    await Promise.all(promises);
  }

  /**
   * Busca múltiplos valores do cache
   * 
   * @param keys Chaves do cache
   * @param options Opções de cache
   * @returns Valores cacheados
   */
  async getMultiple(keys: string[], options: CacheOptions = {}): Promise<Record<string, any>> {
    const results: Record<string, any> = {};

    const promises = keys.map(async (key) => {
      results[key] = await this.get(key, options);
    });

    await Promise.all(promises);

    return results;
  }

  /**
   * Remove valores expirados do cache
   */
  async cleanup(): Promise<void> {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, cached] of this.cache.entries()) {
      if (now > cached.expiresAt) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }

  /**
   * Obtém estatísticas do cache
   * 
   * @returns Estatísticas
   */
  async getStats(): Promise<{
    size: number;
    expired: number;
    valid: number;
  }> {
    let expired = 0;
    let valid = 0;
    const now = Date.now();

    for (const cached of this.cache.values()) {
      if (now > cached.expiresAt) {
        expired++;
      } else {
        valid++;
      }
    }

    return {
      size: this.cache.size,
      expired,
      valid,
    };
  }

  /**
   * Decorator para cachear resultado de função
   * 
   * @param options Opções de cache
   * @returns Decorator
   */
  static cache(options: CacheOptions = {}) {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
      const cacheService = new CacheService();

      descriptor.value = async function (...args: any[]) {
        const key = `${propertyKey}:${JSON.stringify(args)}`;
        
        // Tentar buscar do cache
        const cached = await cacheService.get(key, options);
        if (cached !== null) {
          return cached;
        }

        // Executar função original
        const result = await originalMethod.apply(this, args);

        // Cachear resultado
        await cacheService.set(key, result, options);

        return result;
      };

      return descriptor;
    };
  }
}
