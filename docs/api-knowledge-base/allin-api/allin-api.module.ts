/**
 * Allin API Module
 * Integration layer for the external MLM API
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AllinApiService } from './allin-api.service';
// Temporarily disable CacheUtil to prevent Redis connection errors
// import { CacheUtil } from './utils/cache.util';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
  ],
  providers: [
    AllinApiService,
    // CacheUtil,
  ],
  exports: [
    AllinApiService,
    // CacheUtil,
  ],
})
export class AllinApiModule {}
