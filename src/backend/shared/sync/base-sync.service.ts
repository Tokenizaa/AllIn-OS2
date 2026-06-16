/**
 * Base Sync Service
 * 
 * Serviço base para sync com retry logic e error handling.
 */

import { allinService } from '../allin/allin.service';
import {
  SyncResult,
  SyncConfig,
  SyncError,
  SyncWarning,
  SyncStats,
  SyncProgress,
} from './dto/sync-result.dto';

export abstract class BaseSyncService<T> {
  protected config: SyncConfig;
  protected stats: SyncStats = {
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    averageDurationMs: 0,
    totalRecordsProcessed: 0,
  };

  constructor(config?: Partial<SyncConfig>) {
    this.config = {
      batchSize: 100,
      maxRetries: 3,
      retryDelayMs: 1000,
      timeoutMs: 30000,
      enableCache: true,
      cacheTtlMs: 300000, // 5 minutos
      enableLogging: true,
      stopOnError: false,
      ...config,
    };
  }

  /**
   * Executa sync com retry logic
   */
  protected async executeWithRetry<R>(
    operation: () => Promise<R>,
    context: string
  ): Promise<R> {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= this.config.maxRetries!; attempt++) {
      try {
        if (this.config.enableLogging) {
          console.log(`[Sync] ${context} - Attempt ${attempt}/${this.config.maxRetries}`);
        }
        
        const result = await this.executeWithTimeout(operation, this.config.timeoutMs!);
        
        if (this.config.enableLogging) {
          console.log(`[Sync] ${context} - Success on attempt ${attempt}`);
        }
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        if (this.config.enableLogging) {
          console.error(`[Sync] ${context} - Attempt ${attempt} failed:`, error);
        }
        
        if (attempt < this.config.maxRetries!) {
          const delay = this.calculateRetryDelay(attempt);
          await this.sleep(delay);
        }
      }
    }
    
    throw new Error(`${context} failed after ${this.config.maxRetries} attempts: ${lastError?.message}`);
  }

  /**
   * Executa operação com timeout
   */
  protected async executeWithTimeout<R>(
    operation: () => Promise<R>,
    timeoutMs: number
  ): Promise<R> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
      ),
    ]);
  }

  /**
   * Calcula delay para retry com exponential backoff
   */
  protected calculateRetryDelay(attempt: number): number {
    const baseDelay = this.config.retryDelayMs!;
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * baseDelay;
    return Math.min(exponentialDelay + jitter, 30000); // Máximo 30 segundos
  }

  /**
   * Sleep por um período específico
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Busca dados da API Allin com paginação
   */
  protected async fetchPaginatedData<R>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<R[]> {
    const allData: R[] = [];
    let page = 1;
    let hasMore = true;
    const limit = this.config.batchSize!;

    while (hasMore) {
      try {
        const queryParams = new URLSearchParams({
          ...params,
          page: page.toString(),
          limit: limit.toString(),
        });

        const url = `${endpoint}?${queryParams.toString()}`;
        
        const response = await this.executeWithRetry(
          () => this.requestFromAllIn<R[]>(url),
          `Fetch paginated data: ${endpoint} page ${page}`
        );

        if (Array.isArray(response) && response.length > 0) {
          allData.push(...response);
          hasMore = response.length === limit;
          page++;
        } else {
          hasMore = false;
        }
      } catch (error) {
        if (this.config.stopOnError) {
          throw error;
        }
        
        console.error(`[Sync] Error fetching page ${page} of ${endpoint}:`, error);
        hasMore = false;
      }
    }

    return allData;
  }

  /**
   * Faz request genérico para API Allin
   */
  private async requestFromAllIn<T>(endpoint: string): Promise<T> {
    // Usar reflection para acessar o método privado request
    const allinServiceInstance = allinService as any;
    const result = await allinServiceInstance.request(endpoint);
    return result as T;
  }

  /**
   * Cria resultado de sync inicial
   */
  protected createSyncResult(): SyncResult {
    return {
      success: false,
      totalRecords: 0,
      processedRecords: 0,
      failedRecords: 0,
      skippedRecords: 0,
      errors: [],
      warnings: [],
      startTime: new Date(),
      endTime: new Date(),
      durationMs: 0,
    };
  }

  /**
   * Finaliza resultado de sync
   */
  protected finalizeSyncResult(result: SyncResult): SyncResult {
    result.endTime = new Date();
    result.durationMs = result.endTime.getTime() - result.startTime.getTime();
    result.success = result.failedRecords === 0;
    
    // Atualiza estatísticas
    this.stats.totalSyncs++;
    this.stats.totalRecordsProcessed += result.processedRecords;
    
    if (result.success) {
      this.stats.successfulSyncs++;
    } else {
      this.stats.failedSyncs++;
    }
    
    this.stats.lastSyncTime = result.endTime;
    this.stats.averageDurationMs = 
      (this.stats.averageDurationMs * (this.stats.totalSyncs - 1) + result.durationMs) / 
      this.stats.totalSyncs;
    
    return result;
  }

  /**
   * Adiciona erro ao resultado de sync
   */
  protected addError(result: SyncResult, recordId: string | undefined, message: string, error?: Error): void {
    result.errors.push({
      recordId,
      message,
      error,
      timestamp: new Date(),
    });
    result.failedRecords++;
  }

  /**
   * Adiciona warning ao resultado de sync
   */
  protected addWarning(result: SyncResult, recordId: string | undefined, message: string): void {
    result.warnings.push({
      recordId,
      message,
      timestamp: new Date(),
    });
    result.skippedRecords++;
  }

  /**
   * Processa um lote de registros
   */
  protected async processBatch(
    batch: T[],
    processor: (item: T) => Promise<void>,
    result: SyncResult
  ): Promise<void> {
    for (const item of batch) {
      try {
        await processor(item);
        result.processedRecords++;
      } catch (error) {
        const recordId = (item as any).id || (item as any).allin_id;
        this.addError(result, recordId, `Failed to process record`, error as Error);
        
        if (this.config.stopOnError) {
          throw error;
        }
      }
    }
  }

  /**
   * Processa todos os registros em lotes
   */
  protected async processAllBatches(
    allRecords: T[],
    processor: (item: T) => Promise<void>,
    result: SyncResult,
    progressCallback?: (progress: SyncProgress) => void
  ): Promise<void> {
    result.totalRecords = allRecords.length;
    const batchSize = this.config.batchSize!;
    const totalBatches = Math.ceil(allRecords.length / batchSize);
    
    for (let i = 0; i < allRecords.length; i += batchSize) {
      const batch = allRecords.slice(i, i + batchSize);
      const currentBatch = Math.floor(i / batchSize) + 1;
      
      if (progressCallback) {
        progressCallback({
          syncId: this.generateSyncId(),
          entity: this.getEntityName(),
          status: 'running',
          progress: (i / allRecords.length) * 100,
          totalRecords: allRecords.length,
          processedRecords: result.processedRecords,
          startTime: result.startTime,
          currentBatch,
          totalBatches,
        });
      }
      
      await this.processBatch(batch, processor, result);
    }
    
    if (progressCallback) {
      progressCallback({
        syncId: this.generateSyncId(),
        entity: this.getEntityName(),
        status: 'completed',
        progress: 100,
        totalRecords: allRecords.length,
        processedRecords: result.processedRecords,
        startTime: result.startTime,
        endTime: new Date(),
        currentBatch: totalBatches,
        totalBatches,
      });
    }
  }

  /**
   * Gera ID único para sync
   */
  protected generateSyncId(): string {
    return `${this.getEntityName()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtém estatísticas de sync
   */
  getStats(): SyncStats {
    return { ...this.stats };
  }

  /**
   * Reseta estatísticas de sync
   */
  resetStats(): void {
    this.stats = {
      totalSyncs: 0,
      successfulSyncs: 0,
      failedSyncs: 0,
      averageDurationMs: 0,
      totalRecordsProcessed: 0,
    };
  }

  /**
   * Método abstrato para obter nome da entidade
   */
  protected abstract getEntityName(): string;

  /**
   * Método abstrato para executar sync
   */
  public abstract sync(params?: any): Promise<SyncResult>;

  /**
   * Método abstrato para mapear dados da API Allin para entidade local
   */
  protected abstract mapFromAllin(data: any): T;
}
