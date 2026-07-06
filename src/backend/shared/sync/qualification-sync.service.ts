/**
 * Qualification Sync Service
 * 
 * Serviço para sync de qualificações da API Allin.
 */

import { BaseSyncService } from './base-sync.service';
import { allinService } from '../allin/allin.service';
import { QualificationMapper, LocalQualification } from './mappers/qualification.mapper';
import { SyncResult } from './dto/sync-result.dto';
import { DistribuidorRepository } from '../../modules/distributors/repositories/distributor.repository';

export class QualificationSyncService extends BaseSyncService<LocalQualification> {
  private distributorRepository: DistribuidorRepository;

  constructor(config?: { batchSize?: number; maxRetries?: number; retryDelayMs?: number }) {
    super(config);
    this.distributorRepository = new DistribuidorRepository();
  }

  /**
   * Obtém nome da entidade
   */
  protected getEntityName(): string {
    return 'qualifications';
  }

  /**
   * Mapeia dados da API Allin para entidade local
   */
  protected mapFromAllin(data: any): LocalQualification {
    return QualificationMapper.fromAllin(data);
  }

  /**
   * Executa sync de qualificações
   */
  public async sync(params?: { incremental?: boolean; since?: Date }): Promise<SyncResult> {
    const result = this.createSyncResult();
    
    try {
      console.log('[QualificationSync] Starting sync...');
      
      // Busca todos os distribuidores para sync de qualificações
      const distributors = await this.distributorRepository.findAll({});
      
      console.log(`[QualificationSync] Found ${distributors.length} distributors to sync qualifications`);
      
      // Para cada distribuidor, busca sua qualificação atual
      for (const distributor of distributors) {
        try {
          const allinId = distributor.allin_id;
          if (!allinId) {
            console.log(`[QualificationSync] Skipping distributor ${distributor.id} - no allin_id`);
            continue;
          }
          
          const allinQualification = await this.executeWithRetry(
            () => allinService.getDistribuidorQualificacaoAtual(allinId),
            `Fetch qualification for distributor ${allinId} from AllIn`
          );
          
          if (allinQualification) {
            const localQualification = QualificationMapper.fromAllin(allinQualification);
            
            // Atualiza o distribuidor com a qualificação (usando campos disponíveis)
            await this.distributorRepository.update(distributor.id, {
              status: localQualification.qualificacao_nome,
            });
            
            result.processedRecords++;
            console.log(`[QualificationSync] Synced qualification for distributor ${allinId}`);
          }
        } catch (error) {
          console.error(`[QualificationSync] Failed to sync qualification for distributor ${distributor.id}:`, error);
          this.addError(result, distributor.id, 'Failed to sync qualification', error as Error);
          
          if (this.config.stopOnError) {
            throw error;
          }
        }
      }
      
      console.log(`[QualificationSync] Sync completed: ${result.processedRecords} processed, ${result.failedRecords} failed`);
      
    } catch (error) {
      this.addError(result, undefined, 'Sync failed', error as Error);
      console.error('[QualificationSync] Sync failed:', error);
    }
    
    return this.finalizeSyncResult(result);
  }

  /**
   * Sync incremental de qualificações
   */
  public async syncIncremental(since: Date): Promise<SyncResult> {
    return this.sync({ incremental: true, since });
  }

  /**
   * Sync de qualificação de um distribuidor específico
   */
  public async syncDistributorQualification(distributorId: string): Promise<SyncResult> {
    const result = this.createSyncResult();
    
    try {
      console.log(`[QualificationSync] Syncing qualification for distributor ${distributorId}...`);
      
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
      
      const allinQualification = await this.executeWithRetry(
        () => allinService.getDistribuidorQualificacaoAtual(allinId),
        `Fetch qualification for distributor ${allinId} from AllIn`
      );
      
      if (allinQualification) {
        const localQualification = QualificationMapper.fromAllin(allinQualification);
        
        await this.distributorRepository.update(distributor.id, {
          status: localQualification.qualificacao_nome,
        });
        
        result.processedRecords++;
        console.log(`[QualificationSync] Synced qualification for distributor ${allinId}`);
      }
      
      console.log(`[QualificationSync] Sync completed for distributor ${distributorId}`);
      
    } catch (error) {
      this.addError(result, distributorId, 'Sync failed', error as Error);
      console.error(`[QualificationSync] Sync failed for distributor ${distributorId}:`, error);
    }
    
    return this.finalizeSyncResult(result);
  }
}
