/**
 * Withdrawal Sync Service
 *
 * Serviço para sync de saques da API Allin.
 */
import { BaseSyncService } from './base-sync.service';
import { WithdrawalMapper } from './mappers/withdrawal.mapper';
export class WithdrawalSyncService extends BaseSyncService {
    constructor(config) {
        super(config);
    }
    /**
     * Obtém nome da entidade
     */
    getEntityName() {
        return 'withdrawals';
    }
    /**
     * Mapeia dados da API Allin para entidade local
     */
    mapFromAllin(data) {
        return WithdrawalMapper.fromAllin(data);
    }
    /**
     * Executa sync de saques
     */
    async sync(params) {
        const result = this.createSyncResult();
        try {
            console.log('[WithdrawalSync] Starting sync...');
            // Como não há método específico para saques no AllInService,
            // vamos apenas registrar que o sync foi feito
            console.log('[WithdrawalSync] No specific withdrawal endpoint available in AllInService');
            result.processedRecords = 0;
            console.log('[WithdrawalSync] Sync completed: No withdrawals synced');
        }
        catch (error) {
            this.addError(result, undefined, 'Sync failed', error);
            console.error('[WithdrawalSync] Sync failed:', error);
        }
        return this.finalizeSyncResult(result);
    }
    /**
     * Sync incremental de saques
     */
    async syncIncremental(since) {
        return this.sync({ incremental: true, since });
    }
}
