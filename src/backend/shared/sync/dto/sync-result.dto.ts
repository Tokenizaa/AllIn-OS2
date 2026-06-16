/**
 * Sync Result DTOs
 * 
 * DTOs para resultados de operações de sync.
 */

export interface SyncResult {
  success: boolean;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  skippedRecords: number;
  errors: SyncError[];
  warnings: SyncWarning[];
  startTime: Date;
  endTime: Date;
  durationMs: number;
}

export interface SyncError {
  recordId?: string;
  message: string;
  error?: Error;
  timestamp: Date;
}

export interface SyncWarning {
  recordId?: string;
  message: string;
  timestamp: Date;
}

export interface SyncConfig {
  batchSize?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
  enableCache?: boolean;
  cacheTtlMs?: number;
  enableLogging?: boolean;
  stopOnError?: boolean;
}

export interface SyncStats {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  lastSyncTime?: Date;
  averageDurationMs: number;
  totalRecordsProcessed: number;
}

export interface SyncProgress {
  syncId: string;
  entity: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  startTime: Date;
  endTime?: Date;
  currentBatch?: number;
  totalBatches?: number;
}
