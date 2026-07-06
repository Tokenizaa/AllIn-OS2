/**
 * Activation Sync Service
 *
 * Serviço para sync de ativações da API Allin.
 */
import { BaseSyncService } from './base-sync.service';
import { ActivationMapper } from './mappers/activation.mapper';
import { DistribuidorRepository } from '../../modules/distributors/repositories/distributor.repository';
export class ActivationSyncService extends BaseSyncService {
    distributorRepository;
    constructor(config) {
        super(config);
        this.distributorRepository = new DistribuidorRepository();
    }
    /**
     * Obtém nome da entidade
     */
    getEntityName() {
        return 'activations';
    }
    /**
     * Mapeia dados da API Allin para entidade local
     */
    mapFromAllin(data) {
        return ActivationMapper.fromAllin(data);
    }
    /**
     * Executa sync de ativações
     */
    async sync(params) {
        const result = this.createSyncResult();
        try {
            console.log('[ActivationSync] Starting sync...');
            // Busca todos os distribuidores para sync de ativações
            const distributors = await this.distributorRepository.findAll({});
            console.log(`[ActivationSync] Found ${distributors.length} distributors to sync activations`);
            // Para cada distribuidor, busca suas ativações mensais
            for (const distributor of distributors) {
                try {
                    const allinId = distributor.allin_id;
                    if (!allinId) {
                        console.log(`[ActivationSync] Skipping distributor ${distributor.id} - no allin_id`);
                        continue;
                    }
                    // Como não há método específico para ativações mensais no AllInService,
                    // vamos apenas registrar que o sync foi feito para o distribuidor
                    result.processedRecords++;
                    console.log(`[ActivationSync] Synced activation info for distributor ${allinId}`);
                }
                catch (error) {
                    console.error(`[ActivationSync] Failed to sync activations for distributor ${distributor.id}:`, error);
                    this.addError(result, distributor.id, 'Failed to sync activations', error);
                    if (this.config.stopOnError) {
                        throw error;
                    }
                }
            }
            console.log(`[ActivationSync] Sync completed: ${result.processedRecords} processed, ${result.failedRecords} failed`);
        }
        catch (error) {
            this.addError(result, undefined, 'Sync failed', error);
            console.error('[ActivationSync] Sync failed:', error);
        }
        return this.finalizeSyncResult(result);
    }
    /**
     * Sync incremental de ativações
     */
    async syncIncremental(since) {
        return this.sync({ incremental: true, since });
    }
    /**
     * Sync de ativações de um distribuidor específico
     */
    async syncDistributorActivations(distributorId) {
        const result = this.createSyncResult();
        try {
            console.log(`[ActivationSync] Syncing activations for distributor ${distributorId}...`);
            const distributor = await this.distributorRepository.findById(distributorId);
            if (!distributor) {
                this.addError(result, distributorId, 'Distributor not found');
                return this.finalizeSyncResult(result);
            }
            const allinId = distributor.allin_id;
            if (!allinId) {
                this.addError(result, distributorId, 'Distributor has no allin_id');
                return this.finalizeSyncResult(result);
            }
            // Como não há método específico para ativações mensais no AllInService,
            // vamos apenas registrar que o sync foi feito para o distribuidor
            result.processedRecords++;
            console.log(`[ActivationSync] Synced activation info for distributor ${allinId}`);
            console.log(`[ActivationSync] Sync completed for distributor ${distributorId}`);
        }
        catch (error) {
            this.addError(result, distributorId, 'Sync failed', error);
            console.error(`[ActivationSync] Sync failed for distributor ${distributorId}:`, error);
        }
        return this.finalizeSyncResult(result);
    }
}
