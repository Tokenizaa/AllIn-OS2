/**
 * Distributor Sync Service
 *
 * Serviço para sync de distribuidores da API Allin.
 */
import { BaseSyncService } from './base-sync.service';
import { allinService } from '../allin/allin.service';
import { DistributorMapper } from './mappers/distributor.mapper';
import { DistributorRepository } from '../../modules/distributors/repositories/distributor.repository';
export class DistributorSyncService extends BaseSyncService {
    distributorRepository;
    constructor(config) {
        super(config);
        this.distributorRepository = new DistributorRepository();
    }
    /**
     * Obtém nome da entidade
     */
    getEntityName() {
        return 'distributors';
    }
    /**
     * Mapeia dados da API Allin para entidade local
     */
    mapFromAllin(data) {
        return DistributorMapper.fromAllin(data);
    }
    /**
     * Executa sync de distribuidores
     */
    async sync(params) {
        const result = this.createSyncResult();
        try {
            console.log('[DistributorSync] Starting sync...');
            // Busca distribuidores da API Allin
            const allinDistributors = await this.executeWithRetry(() => allinService.getDistribuidores(), 'Fetch distributors from AllIn');
            console.log(`[DistributorSync] Fetched ${allinDistributors.length} distributors from AllIn`);
            // Converte para formato local
            const localDistributors = DistributorMapper.fromAllinArray(allinDistributors);
            // Processa todos os distribuidores
            await this.processAllBatches(localDistributors, async (distributor) => await this.processDistributor(distributor, params), result);
            console.log(`[DistributorSync] Sync completed: ${result.processedRecords} processed, ${result.failedRecords} failed`);
        }
        catch (error) {
            this.addError(result, undefined, 'Sync failed', error);
            console.error('[DistributorSync] Sync failed:', error);
        }
        return this.finalizeSyncResult(result);
    }
    /**
     * Processa um distribuidor individual
     */
    async processDistributor(distributor, params) {
        try {
            // Verifica se distribuidor já existe localmente
            const existing = await this.distributorRepository.findByAllinId(distributor.allin_id);
            if (existing.length > 0) {
                // Atualiza distribuidor existente
                const localDistributor = existing[0];
                // Verifica se precisa de sync (para sync incremental)
                if (params?.incremental && params.since) {
                    const allinDistributor = await this.executeWithRetry(() => allinService.getDistribuidorById(parseInt(distributor.allin_id)), `Fetch distributor ${distributor.allin_id} from AllIn`);
                    if (allinDistributor && !DistributorMapper.needsSync(localDistributor, allinDistributor)) {
                        // Não precisa de sync, skip
                        return;
                    }
                }
                await this.distributorRepository.update(localDistributor.id, {
                    ...distributor,
                    id: localDistributor.id, // Mantém o ID local
                });
                console.log(`[DistributorSync] Updated distributor ${distributor.allin_id}`);
            }
            else {
                // Cria novo distribuidor
                await this.distributorRepository.create(distributor);
                console.log(`[DistributorSync] Created distributor ${distributor.allin_id}`);
            }
        }
        catch (error) {
            console.error(`[DistributorSync] Failed to process distributor ${distributor.allin_id}:`, error);
            throw error;
        }
    }
    /**
     * Sync incremental de distribuidores
     */
    async syncIncremental(since) {
        return this.sync({ incremental: true, since });
    }
    /**
     * Sync de um distribuidor específico
     */
    async syncDistributor(allinId) {
        const result = this.createSyncResult();
        try {
            console.log(`[DistributorSync] Syncing distributor ${allinId}...`);
            // Busca distribuidor da API Allin
            const allinDistributor = await this.executeWithRetry(() => allinService.getDistribuidorById(parseInt(allinId)), `Fetch distributor ${allinId} from AllIn`);
            if (!allinDistributor) {
                this.addError(result, allinId, 'Distributor not found in AllIn');
                return this.finalizeSyncResult(result);
            }
            // Converte para formato local
            const localDistributor = DistributorMapper.fromAllin(allinDistributor);
            // Processa distribuidor
            await this.processDistributor(localDistributor);
            result.processedRecords++;
            console.log(`[DistributorSync] Sync completed for distributor ${allinId}`);
        }
        catch (error) {
            this.addError(result, allinId, 'Sync failed', error);
            console.error(`[DistributorSync] Sync failed for distributor ${allinId}:`, error);
        }
        return this.finalizeSyncResult(result);
    }
}
