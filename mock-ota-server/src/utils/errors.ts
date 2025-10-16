import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { MockError } from '../types';

// Base Error Class
export class BaseError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message: string, statusCode: number, code: string, isOperational: boolean = true, details?: any) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific Error Classes for Mock OTA Server
export class MockAPIError extends BaseError {
  constructor(message: string = 'Mock API error', statusCode: number = 500, details?: any) {
    super(message, statusCode, 'MOCK_API_ERROR', true, details);
  }
}

export class RateLimitError extends BaseError {
  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', true, { retryAfter });
  }
}

export class ValidationError extends BaseError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', true, details);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 404, 'NOT_FOUND', true, details);
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string = 'Authentication failed', details?: any) {
    super(message, 401, 'AUTHENTICATION_ERROR', true, details);
  }
}

export class AuthorizationError extends BaseError {
  constructor(message: string = 'Unauthorized access', details?: any) {
    super(message, 403, 'AUTHORIZATION_ERROR', true, details);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string = 'Resource conflict', details?: any) {
    super(message, 409, 'CONFLICT', true, details);
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(message: string = 'Service temporarily unavailable', details?: any) {
    super(message, 503, 'SERVICE_UNAVAILABLE', true, details);
  }
}

export class WebhookError extends BaseError {
  constructor(message: string = 'Webhook processing failed', details?: any) {
    super(message, 500, 'WEBHOOK_ERROR', true, details);
  }
}

// Error factory for easier error creation
export const createError = {
  mockAPI: (message?: string, statusCode?: number, details?: any) => new MockAPIError(message, statusCode, details),
  rateLimit: (message?: string, retryAfter?: number) => new RateLimitError(message, retryAfter),
  validation: (message?: string, details?: any) => new ValidationError(message, details),
  notFound: (message?: string, details?: any) => new NotFoundError(message, details),
  authentication: (message?: string, details?: any) => new AuthenticationError(message, details),
  authorization: (message?: string, details?: any) => new AuthorizationError(message, details),
  conflict: (message?: string, details?: any) => new ConflictError(message, details),
  serviceUnavailable: (message?: string, details?: any) => new ServiceUnavailableError(message, details),
  webhook: (message?: string, details?: any) => new WebhookError(message, details),
  internal: (message: string = 'Internal Server Error', details?: any) => new BaseError(message, 500, 'INTERNAL_SERVER_ERROR', false, details),
};

// Async handler to catch errors in async express routes
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Centralized error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  let error = err;
  if (!(error instanceof BaseError)) {
    // Convert non-operational errors to a generic operational error
    error = createError.internal('An unexpected error occurred.');
    logger.error(`Non-operational Error: ${err.message}`, { 
      stack: err.stack, 
      originalError: err,
      url: req.originalUrl,
      method: req.method
    });
  } else {
    logger.error(`Operational Error: ${error.message}`, { 
      stack: error.stack, 
      code: error.code, 
      status: error.statusCode, 
      details: (error as BaseError).details,
      url: req.originalUrl,
      method: req.method
    });
  }

  const baseError = error as BaseError;
  const statusCode = baseError.statusCode || 500;
  const message = baseError.message || 'An unexpected error occurred.';
  const code = baseError.code || 'UNEXPECTED_ERROR';
  const details = baseError.details || {};

  // Add rate limit headers if it's a rate limit error
  if (error instanceof RateLimitError && error.details?.retryAfter) {
    res.set('Retry-After', error.details.retryAfter.toString());
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};

// Helper function to simulate random errors based on error rate
export const shouldSimulateError = (errorRate: number = 5): boolean => {
  return Math.random() * 100 < errorRate;
};

// Helper function to get random error
export const getRandomError = (): MockError => {
  const errors: MockError[] = [
    {
      code: 'TEMPORARY_UNAVAILABLE',
      message: 'Service temporarily unavailable',
      statusCode: 503,
      details: { retryAfter: 30 }
    },
    {
      code: 'INVALID_REQUEST',
      message: 'Invalid request parameters',
      statusCode: 400,
      details: { field: 'unknown' }
    },
    {
      code: 'AUTHENTICATION_FAILED',
      message: 'Invalid API credentials',
      statusCode: 401,
      details: { reason: 'expired_token' }
    },
    {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests',
      statusCode: 429,
      details: { retryAfter: 60 }
    },
    {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
      statusCode: 500,
      details: { requestId: Math.random().toString(36).substring(7) }
    }
  ];

  return errors[Math.floor(Math.random() * errors.length)];
};


