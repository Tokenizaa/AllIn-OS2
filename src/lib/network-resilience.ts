/**
 * Network Resilience Utilities
 * Handles retry logic, timeout protection, and network error recovery
 */

export class NetworkError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'NetworkError';
  }
}

export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Execute a function with retry logic for network failures
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    onRetry,
  } = options;

  let lastError: Error | undefined;
  let delay = delayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on certain errors
      if (error?.code === 'PGRST116' || // Not found
          error?.code === '23505' || // Unique violation
          error?.message?.includes('suspended') ||
          error?.message?.includes('bloqueada')) {
        throw error;
      }

      // Check if it's a network error worth retrying
      const isNetworkError = 
        error?.message?.includes('fetch') ||
        error?.message?.includes('network') ||
        error?.message?.includes('ECONNREFUSED') ||
        error?.message?.includes('ETIMEDOUT') ||
        error?.message?.includes('ERR_NAME_NOT_RESOLVED') ||
        error?.message?.includes('ERR_QUIC') ||
        error?.code === 'NETWORK_ERROR';

      if (!isNetworkError || attempt === maxRetries) {
        throw error;
      }

      console.warn(`[NetworkResilience] Retry attempt ${attempt + 1}/${maxRetries} after error:`, error.message);

      if (onRetry) {
        onRetry(attempt + 1, error);
      }

      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= backoffMultiplier;
    }
  }

  throw new NetworkError(`Failed after ${maxRetries} retries`, lastError);
}

/**
 * Execute a function with timeout protection
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
  );

  return Promise.race([fn(), timeoutPromise]);
}

/**
 * Check if error is a network-related error
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = error.message || '';
  const errorCode = error.code || '';

  return (
    errorMessage.includes('fetch') ||
    errorMessage.includes('network') ||
    errorMessage.includes('ECONNREFUSED') ||
    errorMessage.includes('ETIMEDOUT') ||
    errorMessage.includes('ERR_NAME_NOT_RESOLVED') ||
    errorMessage.includes('ERR_QUIC') ||
    errorMessage.includes('ERR_CONNECTION') ||
    errorCode === 'NETWORK_ERROR' ||
    errorCode === 'TIMEOUT'
  );
}

/**
 * Get user-friendly error message for network errors
 */
export function getNetworkErrorMessage(error: any): string {
  if (!error) return 'Erro desconhecido';

  if (error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
  }

  if (error.message?.includes('ERR_QUIC') || error.message?.includes('QUIC')) {
    return 'Erro de protocolo de rede. Tente novamente ou desabilite extensões do navegador.';
  }

  if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
    return 'A operação demorou muito tempo. Verifique sua conexão e tente novamente.';
  }

  if (error.message?.includes('ECONNREFUSED')) {
    return 'O servidor recusou a conexão. O serviço pode estar temporariamente indisponível.';
  }

  return error.message || 'Erro de conexão. Verifique sua internet e tente novamente.';
}
