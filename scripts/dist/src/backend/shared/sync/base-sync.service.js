/**
 * Base Sync Service
 *
 * Serviço base para sync com retry logic e error handling.
 */
import { allinService } from '../allin/allin.service';
export class BaseSyncService {
    config;
    stats = {
        totalSyncs: 0,
        successfulSyncs: 0,
        failedSyncs: 0,
        averageDurationMs: 0,
        totalRecordsProcessed: 0,
    };
    constructor(config) {
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
    async executeWithRetry(operation, context) {
        let lastError;
        for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
            try {
                if (this.config.enableLogging) {
                    console.log(`[Sync] ${context} - Attempt ${attempt}/${this.config.maxRetries}`);
                }
                const result = await this.executeWithTimeout(operation, this.config.timeoutMs);
                if (this.config.enableLogging) {
                    console.log(`[Sync] ${context} - Success on attempt ${attempt}`);
                }
                return result;
            }
            catch (error) {
                lastError = error;
                if (this.config.enableLogging) {
                    console.error(`[Sync] ${context} - Attempt ${attempt} failed:`, error);
                }
                if (attempt < this.config.maxRetries) {
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
    async executeWithTimeout(operation, timeoutMs) {
        return Promise.race([
            operation(),
            new Promise((_, reject) => setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)),
        ]);
    }
    /**
     * Calcula delay para retry com exponential backoff
     */
    calculateRetryDelay(attempt) {
        const baseDelay = this.config.retryDelayMs;
        const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
        const jitter = Math.random() * baseDelay;
        return Math.min(exponentialDelay + jitter, 30000); // Máximo 30 segundos
    }
    /**
     * Sleep por um período específico
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Busca dados da API Allin com paginação
     */
    async fetchPaginatedData(endpoint, params = {}) {
        const allData = [];
        let page = 1;
        let hasMore = true;
        const limit = this.config.batchSize;
        while (hasMore) {
            try {
                const queryParams = new URLSearchParams({
                    ...params,
                    page: page.toString(),
                    limit: limit.toString(),
                });
                const url = `${endpoint}?${queryParams.toString()}`;
                const response = await this.executeWithRetry(() => this.requestFromAllIn(url), `Fetch paginated data: ${endpoint} page ${page}`);
                if (Array.isArray(response) && response.length > 0) {
                    allData.push(...response);
                    hasMore = response.length === limit;
                    page++;
                }
                else {
                    hasMore = false;
                }
            }
            catch (error) {
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
    async requestFromAllIn(endpoint) {
        // Usar reflection para acessar o método privado request
        const allinServiceInstance = allinService;
        const result = await allinServiceInstance.request(endpoint);
        return result;
    }
    /**
     * Cria resultado de sync inicial
     */
    createSyncResult() {
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
    finalizeSyncResult(result) {
        result.endTime = new Date();
        result.durationMs = result.endTime.getTime() - result.startTime.getTime();
        result.success = result.failedRecords === 0;
        // Atualiza estatísticas
        this.stats.totalSyncs++;
        this.stats.totalRecordsProcessed += result.processedRecords;
        if (result.success) {
            this.stats.successfulSyncs++;
        }
        else {
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
    addError(result, recordId, message, error) {
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
    addWarning(result, recordId, message) {
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
    async processBatch(batch, processor, result) {
        for (const item of batch) {
            try {
                await processor(item);
                result.processedRecords++;
            }
            catch (error) {
                const recordId = item.id || item.allin_id;
                this.addError(result, recordId, `Failed to process record`, error);
                if (this.config.stopOnError) {
                    throw error;
                }
            }
        }
    }
    /**
     * Processa todos os registros em lotes
     */
    async processAllBatches(allRecords, processor, result, progressCallback) {
        result.totalRecords = allRecords.length;
        const batchSize = this.config.batchSize;
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
    generateSyncId() {
        return `${this.getEntityName()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Obtém estatísticas de sync
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Reseta estatísticas de sync
     */
    resetStats() {
        this.stats = {
            totalSyncs: 0,
            successfulSyncs: 0,
            failedSyncs: 0,
            averageDurationMs: 0,
            totalRecordsProcessed: 0,
        };
    }
}
