/**
 * Retry Utility Unit Tests
 */

import { RetryUtil } from '../utils/retry.util';

describe('RetryUtil', () => {
  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const operation = jest.fn().mockResolvedValue('success');

      const result = await RetryUtil.withRetry(operation);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on retryable errors', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce({ code: 'ECONNRESET' })
        .mockResolvedValue('success');

      const result = await RetryUtil.withRetry(operation, {
        maxRetries: 3,
        baseDelay: 10,
      });

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should retry on 5xx status codes', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce({ response: { status: 500 } })
        .mockResolvedValue('success');

      const result = await RetryUtil.withRetry(operation, {
        maxRetries: 3,
        baseDelay: 10,
      });

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-retryable errors', async () => {
      const operation = jest.fn()
        .mockRejectedValue({ code: 'SOME_OTHER_ERROR' });

      await expect(
        RetryUtil.withRetry(operation, {
          maxRetries: 3,
          baseDelay: 10,
        })
      ).rejects.toThrow();

      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should call onRetry callback', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce({ code: 'ECONNRESET' })
        .mockResolvedValue('success');
      const onRetry = jest.fn();

      await RetryUtil.withRetry(operation, {
        maxRetries: 3,
        baseDelay: 10,
        onRetry,
      });

      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error));
    });

    it('should use exponential backoff', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce({ code: 'ECONNRESET' })
        .mockRejectedValueOnce({ code: 'ECONNRESET' })
        .mockResolvedValue('success');

      const startTime = Date.now();
      await RetryUtil.withRetry(operation, {
        maxRetries: 3,
        baseDelay: 100,
      });
      const endTime = Date.now();

      // Should have waited at least 100ms + 200ms = 300ms
      expect(endTime - startTime).toBeGreaterThanOrEqual(300);
    });

    it('should respect max delay', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce({ code: 'ECONNRESET' })
        .mockResolvedValue('success');

      const startTime = Date.now();
      await RetryUtil.withRetry(operation, {
        maxRetries: 3,
        baseDelay: 100,
        maxDelay: 50,
      });
      const endTime = Date.now();

      // Should not exceed max delay
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should throw after max retries', async () => {
      const operation = jest.fn()
        .mockRejectedValue({ code: 'ECONNRESET' });

      await expect(
        RetryUtil.withRetry(operation, {
          maxRetries: 2,
          baseDelay: 10,
        })
      ).rejects.toThrow();

      expect(operation).toHaveBeenCalledTimes(2);
    });
  });
});
