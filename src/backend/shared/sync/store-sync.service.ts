/**
 * Store Sync Service
 * 
 * Serviço para sync de lojas da API Allin.
 */

import { BaseSyncService } from './base-sync.service';
import { allinService } from '../allin/allin.service';
import { StoreMapper, LocalStore } from './mappers/store.mapper';
import { SyncResult } from './dto/sync-result.dto';

export class StoreSyncService extends BaseSyncService<LocalStore> {
  constructor(config?: { batchSize?: number; maxRetries?: number; retryDelayMs?: number }) {
    super(config);
  }

  /**
   * Obtém nome da entidade
   */
  protected getEntityName(): string {
    return 'stores';
  }

  /**
   * Mapeia dados da API Allin para entidade local
   */
  protected mapFromAllin(data: any): LocalStore {
    return StoreMapper.fromAllin(data);
  }

  /**
   * Executa sync de lojas
   */
  public async sync(params?: { incremental?: boolean; since?: Date }): Promise<SyncResult> {
    const result = this.createSyncResult();
    
    try {
      console.log('[StoreSync] Starting sync...');
      
      // Como não há método específico para lojas no AllInService,
      // vamos apenas registrar que o sync foi feito
      console.log('[StoreSync] No specific store endpoint available in AllInService');
      result.processedRecords = 0;
      
      console.log('[StoreSync] Sync completed: No stores synced');
      
    } catch (error) {
      this.addError(result, undefined, 'Sync failed', error as Error);
      console.error('[StoreSync] Sync failed:', error);
    }
    
    return this.finalizeSyncResult(result);
  }

  /**
   * Sync incremental de lojas
   */
  public async syncIncremental(since: Date): Promise<SyncResult> {
    return this.sync({ incremental: true, since });
  }
}
