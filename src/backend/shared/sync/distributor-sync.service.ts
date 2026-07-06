/**
 * Distributor Sync Service
 * 
 * Serviço para sync de distribuidores da API Allin.
 */

import { BaseSyncService } from './base-sync.service';
import { allinService } from '../allin/allin.service';
import { DistributorMapper, LocalDistributor } from './mappers/distributor.mapper';
import { SyncResult } from './dto/sync-result.dto';
import { DistribuidorRepository } from '../../modules/distributors/repositories/distributor.repository';

export class DistributorSyncService extends BaseSyncService<LocalDistributor> {
  private distributorRepository: DistribuidorRepository;

  constructor(config?: { batchSize?: number; maxRetries?: number; retryDelayMs?: number }) {
    super(config);
    this.distributorRepository = new DistribuidorRepository();
  }

  /**
   * Obtém nome da entidade
   */
  protected getEntityName(): string {
    return 'distributors';
  }

  /**
   * Mapeia dados da API Allin para entidade local
   */
  protected mapFromAllin(data: any): LocalDistributor {
    return DistributorMapper.fromAllin(data);
  }

  /**
   * Executa sync de distribuidores
   */
  public async sync(params?: { incremental?: boolean; since?: Date }): Promise<SyncResult> {
    const result = this.createSyncResult();
    
    try {
      console.log('[DistributorSync] Starting sync...');
      
      // Busca distribuidores da API Allin
      const allinDistributors = await this.executeWithRetry(
        () => allinService.getDistribuidores(),
        'Fetch distributors from AllIn'
      );
      
      console.log(`[DistributorSync] Fetched ${allinDistributors.length} distributors from AllIn`);
      
      // Converte para formato local
      const localDistributors = DistributorMapper.fromAllinArray(allinDistributors);
      
      // Processa todos os distribuidores
      await this.processAllBatches(
        localDistributors,
        async (distributor) => await this.processDistributor(distributor, params),
        result
      );
      
      console.log(`[DistributorSync] Sync completed: ${result.processedRecords} processed, ${result.failedRecords} failed`);
      
    } catch (error) {
      this.addError(result, undefined, 'Sync failed', error as Error);
      console.error('[DistributorSync] Sync failed:', error);
    }
    
    return this.finalizeSyncResult(result);
  }

  /**
   * Processa um distribuidor individual
   */
  private async processDistributor(
    distributor: LocalDistributor,
    params?: { incremental?: boolean; since?: Date }
  ): Promise<void> {
    try {
      // Verifica se distribuidor já existe localmente
      const existing = await this.distributorRepository.findByAllinId(distributor.allin_id);
      
      if (existing) {
        // Atualiza distribuidor existente
        
        // Verifica se precisa de sync (para sync incremental)
        if (params?.incremental && params.since) {
          const allinDistributor = await this.executeWithRetry(
            () => allinService.getDistribuidorById(parseInt(distributor.allin_id)),
            `Fetch distributor ${distributor.allin_id} from AllIn`
          );
          
          if (allinDistributor && !DistributorMapper.needsSync(existing, allinDistributor)) {
            // Não precisa de sync, skip
            return;
          }
        }
        
        await this.distributorRepository.update(existing.id, {
          ...distributor,
          id: existing.id, // Mantém o ID local
        });
        
        console.log(`[DistributorSync] Updated distributor ${distributor.allin_id}`);
      } else {
        // Cria novo distribuidor
        console.log(`[DistributorSync] Creating distributor with data:`, JSON.stringify(distributor, null, 2));
        await this.distributorRepository.create(distributor);
        console.log(`[DistributorSync] Created distributor ${distributor.allin_id}`);
      }
    } catch (error) {
      console.error(`[DistributorSync] Failed to process distributor ${distributor.allin_id}:`, error);
      throw error;
    }
  }

  /**
   * Sync incremental de distribuidores
   */
  public async syncIncremental(since: Date): Promise<SyncResult> {
    return this.sync({ incremental: true, since });
  }

  /**
   * Sync de um distribuidor específico
   */
  public async syncDistributor(allinId: string): Promise<SyncResult> {
    const result = this.createSyncResult();
    
    try {
      console.log(`[DistributorSync] Syncing distributor ${allinId}...`);
      
      // Busca distribuidor da API Allin
      const allinDistributor = await this.executeWithRetry(
        () => allinService.getDistribuidorById(parseInt(allinId)),
        `Fetch distributor ${allinId} from AllIn`
      );
      
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
      
    } catch (error) {
      this.addError(result, allinId, 'Sync failed', error as Error);
      console.error(`[DistributorSync] Sync failed for distributor ${allinId}:`, error);
    }
    
    return this.finalizeSyncResult(result);
  }
}
