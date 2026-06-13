/**
 * Error Handler Utility
 * Provides error handling and transformation for API requests
 */

import {
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  RequestTimeoutException,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

export class ErrorHandlerUtil {
  static handleError(error: any): never {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          throw new BadRequestException(data.message || 'Bad request');
        case 401:
          throw new UnauthorizedException('Invalid or expired access token');
        case 403:
          throw new ForbiddenException('Insufficient permissions');
        case 404:
          throw new NotFoundException('Resource not found');
        case 409:
          throw new ConflictException(data.message || 'Resource conflict');
        case 429:
          throw new RequestTimeoutException('Rate limit exceeded');
        case 500:
        case 502:
        case 503:
        case 504:
          throw new InternalServerErrorException(
            data.message || 'Service temporarily unavailable'
          );
        default:
          throw new InternalServerErrorException(
            data.message || `API request failed with status ${status}`
          );
      }
    }

    if (error.code === 'ECONNREFUSED') {
      throw new InternalServerErrorException('Service unavailable - connection refused');
    }

    if (error.code === 'ETIMEDOUT') {
      throw new RequestTimeoutException('Request timeout');
    }

    if (error.code === 'ECONNRESET') {
      throw new InternalServerErrorException('Connection reset by server');
    }

    throw new InternalServerErrorException(
      error.message || 'Network error or service unavailable'
    );
  }

  static logError(context: string, error: any, logger: any): void {
    const errorInfo = {
      context,
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    };

    logger.error(`Error in ${context}:`, errorInfo);
  }
}
