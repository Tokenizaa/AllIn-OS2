/**
 * Cache Utility
 * Provides caching functionality using Redis
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheUtil {
  private readonly logger = new Logger(CacheUtil.name);
  private readonly redis: Redis;
  private readonly defaultTTL: number;

  constructor(private readonly configService: ConfigService) {
    const redisHost = this.configService.get('REDIS_HOST', 'localhost');
    const redisPort = parseInt(this.configService.get('REDIS_PORT', '6379'));
    const redisPassword = this.configService.get('REDIS_PASSWORD');
    const redisDb = this.configService.get('REDIS_DB', 0);

    this.logger.log(`Connecting to Redis at ${redisHost}:${redisPort}`);

    this.redis = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      db: redisDb,
      maxRetriesPerRequest: null,
    });

    this.defaultTTL = this.configService.get('CACHE_DEFAULT_TTL', 300);

    this.redis.on('error', (error) => {
      this.logger.error('Redis connection error:', error);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await this.redis.setex(key, ttl || this.defaultTTL, serialized);
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}:`, error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Cache delete pattern error for ${pattern}:`, error);
    }
  }

  async invalidateDistributorCache(distributorId: number): Promise<void> {
    await Promise.all([
      this.del(`distributor:${distributorId}`),
      this.del(`wallet:${distributorId}`),
      this.del(`network:${distributorId}`),
      this.delPattern(`downlines:${distributorId}:*`),
      this.delPattern(`bonus:distributor:${distributorId}:*`),
      this.delPattern(`orders:distributor:${distributorId}:*`),
    ]);
  }

  async disconnect(): Promise<void> {
    await this.redis.quit();
  }
}
