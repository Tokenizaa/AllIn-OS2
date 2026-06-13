/**
 * Retry Utility
 * Provides retry logic with exponential backoff for API requests
 */

export class RetryUtil {
  static async withRetry<T>(
    operation: () => Promise<T>,
    options: {
      maxRetries?: number;
      baseDelay?: number;
      maxDelay?: number;
      retryableErrors?: string[];
      onRetry?: (attempt: number, error: Error) => void;
    } = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      maxDelay = 10000,
      retryableErrors = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'EAI_AGAIN'],
      onRetry,
    } = options;

    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          throw lastError;
        }

        const isRetryable = retryableErrors.some(code =>
          error.code === code || error.message?.includes(code)
        );

        // Also retry on 5xx status codes
        const isServerError = error.response?.status >= 500;

        if (!isRetryable && !isServerError) {
          throw lastError;
        }

        const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);

        if (onRetry) {
          onRetry(attempt, error);
        }

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}
