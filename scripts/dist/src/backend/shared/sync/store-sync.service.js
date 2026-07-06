/**
 * Store Sync Service
 *
 * Serviço para sync de lojas da API Allin.
 */
import { BaseSyncService } from './base-sync.service';
import { StoreMapper } from './mappers/store.mapper';
export class StoreSyncService extends BaseSyncService {
    constructor(config) {
        super(config);
    }
    /**
     * Obtém nome da entidade
     */
    getEntityName() {
        return 'stores';
    }
    /**
     * Mapeia dados da API Allin para entidade local
     */
    mapFromAllin(data) {
        return StoreMapper.fromAllin(data);
    }
    /**
     * Executa sync de lojas
     */
    async sync(params) {
        const result = this.createSyncResult();
        try {
            console.log('[StoreSync] Starting sync...');
            // Como não há método específico para lojas no AllInService,
            // vamos apenas registrar que o sync foi feito
            console.log('[StoreSync] No specific store endpoint available in AllInService');
            result.processedRecords = 0;
            console.log('[StoreSync] Sync completed: No stores synced');
        }
        catch (error) {
            this.addError(result, undefined, 'Sync failed', error);
            console.error('[StoreSync] Sync failed:', error);
        }
        return this.finalizeSyncResult(result);
    }
    /**
     * Sync incremental de lojas
     */
    async syncIncremental(since) {
        return this.sync({ incremental: true, since });
    }
}
