/**
 * Plan Sync Service
 *
 * Serviço para sync de planos da API Allin.
 */
import { BaseSyncService } from './base-sync.service';
import { allinService } from '../allin/allin.service';
import { PlanMapper } from './mappers/plan.mapper';
import { PlanRepository } from '../../modules/plans/repositories/plan.repository';
export class PlanSyncService extends BaseSyncService {
    planRepository;
    constructor(config) {
        super(config);
        this.planRepository = new PlanRepository();
    }
    /**
     * Obtém nome da entidade
     */
    getEntityName() {
        return 'plans';
    }
    /**
     * Mapeia dados da API Allin para entidade local
     */
    mapFromAllin(data) {
        return PlanMapper.fromAllin(data);
    }
    /**
     * Executa sync de planos
     */
    async sync(params) {
        const result = this.createSyncResult();
        try {
            console.log('[PlanSync] Starting sync...');
            // Busca planos da API Allin
            const allinPlans = await this.executeWithRetry(() => allinService.getPlanos(), 'Fetch plans from AllIn');
            console.log(`[PlanSync] Fetched ${allinPlans.length} plans from AllIn`);
            // Converte para formato local
            const localPlans = PlanMapper.fromAllinArray(allinPlans);
            // Processa todos os planos
            await this.processAllBatches(localPlans, async (plan) => await this.processPlan(plan, params), result);
            console.log(`[PlanSync] Sync completed: ${result.processedRecords} processed, ${result.failedRecords} failed`);
        }
        catch (error) {
            this.addError(result, undefined, 'Sync failed', error);
            console.error('[PlanSync] Sync failed:', error);
        }
        return this.finalizeSyncResult(result);
    }
    /**
     * Processa um plano individual
     */
    async processPlan(plan, params) {
        try {
            // Verifica se plano já existe localmente pelo nome
            const existing = await this.planRepository.findBySlug(plan.nome.toLowerCase().replace(/\s+/g, '-'));
            if (existing) {
                // Atualiza plano existente
                // Verifica se precisa de sync (para sync incremental)
                if (params?.incremental && params.since) {
                    const syncThreshold = 5 * 60 * 1000; // 5 minutos
                    const timeSinceLastSync = Date.now() - plan.allin_synced_at.getTime();
                    if (timeSinceLastSync < syncThreshold) {
                        // Não precisa de sync, skip
                        return;
                    }
                }
                await this.planRepository.update(existing.id, {
                    name: plan.nome,
                    price: plan.valor,
                    is_active: plan.status === 'active',
                    metadata: {
                        ...existing.metadata,
                        allin_id: plan.allin_id,
                        allin_synced_at: plan.allin_synced_at,
                    },
                });
                console.log(`[PlanSync] Updated plan ${plan.allin_id}`);
            }
            else {
                // Cria novo plano
                await this.planRepository.create({
                    name: plan.nome,
                    slug: plan.nome.toLowerCase().replace(/\s+/g, '-'),
                    description: `Plano ${plan.nome}`,
                    price: plan.valor,
                    activation_fee: 0,
                    plan_type: 'standard',
                    is_affiliate: false,
                    is_active: plan.status === 'active',
                    max_generations: 10,
                    direct_bonus_percentage: 10,
                    metadata: {
                        allin_id: plan.allin_id,
                        allin_synced_at: plan.allin_synced_at,
                    },
                });
                console.log(`[PlanSync] Created plan ${plan.allin_id}`);
            }
        }
        catch (error) {
            console.error(`[PlanSync] Failed to process plan ${plan.allin_id}:`, error);
            throw error;
        }
    }
    /**
     * Sync incremental de planos
     */
    async syncIncremental(since) {
        return this.sync({ incremental: true, since });
    }
}
