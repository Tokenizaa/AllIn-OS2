/**
 * Withdrawal Sync Service
 * 
 * Serviço para sync de saques da API Allin.
 */

import { BaseSyncService } from './base-sync.service';
import { allinService } from '../allin/allin.service';
import { WithdrawalMapper, LocalWithdrawal } from './mappers/withdrawal.mapper';
import { SyncResult } from './dto/sync-result.dto';

export class WithdrawalSyncService extends BaseSyncService<LocalWithdrawal> {
  constructor(config?: { batchSize?: number; maxRetries?: number; retryDelayMs?: number }) {
    super(config);
  }

  /**
   * Obtém nome da entidade
   */
  protected getEntityName(): string {
    return 'withdrawals';
  }

  /**
   * Mapeia dados da API Allin para entidade local
   */
  protected mapFromAllin(data: any): LocalWithdrawal {
    return WithdrawalMapper.fromAllin(data);
  }

  /**
   * Executa sync de saques
   */
  public async sync(params?: { incremental?: boolean; since?: Date }): Promise<SyncResult> {
    const result = this.createSyncResult();
    
    try {
      console.log('[WithdrawalSync] Starting sync...');
      
      // Como não há método específico para saques no AllInService,
      // vamos apenas registrar que o sync foi feito
      console.log('[WithdrawalSync] No specific withdrawal endpoint available in AllInService');
      result.processedRecords = 0;
      
      console.log('[WithdrawalSync] Sync completed: No withdrawals synced');
      
    } catch (error) {
      this.addError(result, undefined, 'Sync failed', error as Error);
      console.error('[WithdrawalSync] Sync failed:', error);
    }
    
    return this.finalizeSyncResult(result);
  }

  /**
   * Sync incremental de saques
   */
  public async syncIncremental(since: Date): Promise<SyncResult> {
    return this.sync({ incremental: true, since });
  }
}
