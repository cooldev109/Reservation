import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { shouldSimulateError, getRandomError } from '../utils/errors';

// Middleware to simulate random errors based on error rate
export const simulateRandomErrors = (errorRate: number = 5) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (shouldSimulateError(errorRate)) {
      const error = getRandomError();
      logger.warn(`Simulating error: ${error.code} for ${req.method} ${req.originalUrl}`);
      
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        },
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
      return;
    }
    next();
  };
};

// Middleware to simulate specific error types
export const simulateSpecificError = (errorType: string, probability: number = 10) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (Math.random() * 100 < probability) {
      let error;
      
      switch (errorType) {
        case 'authentication':
          error = {
            code: 'AUTHENTICATION_FAILED',
            message: 'Invalid API credentials',
            statusCode: 401,
            details: { reason: 'expired_token' }
          };
          break;
        case 'authorization':
          error = {
            code: 'AUTHORIZATION_FAILED',
            message: 'Insufficient permissions',
            statusCode: 403,
            details: { required: 'admin_access' }
          };
          break;
        case 'validation':
          error = {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request parameters',
            statusCode: 400,
            details: { field: 'propertyId', reason: 'invalid_format' }
          };
          break;
        case 'notFound':
          error = {
            code: 'NOT_FOUND',
            message: 'Resource not found',
            statusCode: 404,
            details: { resource: 'property' }
          };
          break;
        case 'conflict':
          error = {
            code: 'CONFLICT',
            message: 'Resource conflict',
            statusCode: 409,
            details: { reason: 'duplicate_booking' }
          };
          break;
        case 'rateLimit':
          error = {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests',
            statusCode: 429,
            details: { retryAfter: 60 }
          };
          break;
        case 'serverError':
          error = {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
            statusCode: 500,
            details: { requestId: Math.random().toString(36).substring(7) }
          };
          break;
        case 'serviceUnavailable':
          error = {
            code: 'SERVICE_UNAVAILABLE',
            message: 'Service temporarily unavailable',
            statusCode: 503,
            details: { retryAfter: 30 }
          };
          break;
        default:
          error = getRandomError();
      }
      
      logger.warn(`Simulating ${errorType} error for ${req.method} ${req.originalUrl}`);
      
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        },
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
      return;
    }
    next();
  };
};

// Middleware to simulate OTA-specific errors
export const simulateOTAErrors = (otaType: string, errorRate: number = 3) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (Math.random() * 100 < errorRate) {
      const otaErrors: { [key: string]: any } = {
        airbnb: {
          code: 'AIRBNB_API_ERROR',
          message: 'Airbnb API temporarily unavailable',
          statusCode: 503,
          details: { retryAfter: 120, errorCode: 'API_MAINTENANCE' }
        },
        booking: {
          code: 'BOOKING_API_ERROR',
          message: 'Booking.com API rate limit exceeded',
          statusCode: 429,
          details: { retryAfter: 300, errorCode: 'RATE_LIMIT' }
        },
        expedia: {
          code: 'EXPEDIA_API_ERROR',
          message: 'Expedia API authentication failed',
          statusCode: 401,
          details: { errorCode: 'AUTH_FAILED', reason: 'invalid_credentials' }
        },
        agoda: {
          code: 'AGODA_API_ERROR',
          message: 'Agoda API validation error',
          statusCode: 400,
          details: { errorCode: 'VALIDATION_ERROR', field: 'checkin_date' }
        },
        vrbo: {
          code: 'VRBO_API_ERROR',
          message: 'Vrbo API service unavailable',
          statusCode: 503,
          details: { retryAfter: 60, errorCode: 'SERVICE_DOWN' }
        }
      };
      
      const error = otaErrors[otaType] || getRandomError();
      
      logger.warn(`Simulating ${otaType} API error for ${req.method} ${req.originalUrl}`);
      
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        },
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
      return;
    }
    next();
  };
};

// Middleware to simulate webhook delivery failures
export const simulateWebhookFailures = (failureRate: number = 2) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.path.includes('/webhook') && Math.random() * 100 < failureRate) {
      logger.warn(`Simulating webhook delivery failure for ${req.method} ${req.originalUrl}`);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'WEBHOOK_DELIVERY_FAILED',
          message: 'Webhook delivery failed',
          details: { 
            reason: 'endpoint_unavailable',
            retryAfter: 30,
            attempt: Math.floor(Math.random() * 3) + 1
          }
        },
        timestamp: new Date().toISOString()
      });
      return;
    }
    next();
  };
};

// Middleware to simulate data inconsistency errors
export const simulateDataInconsistency = (inconsistencyRate: number = 1) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (Math.random() * 100 < inconsistencyRate) {
      logger.warn(`Simulating data inconsistency for ${req.method} ${req.originalUrl}`);
      
      res.status(409).json({
        success: false,
        error: {
          code: 'DATA_INCONSISTENCY',
          message: 'Data inconsistency detected',
          details: { 
            reason: 'concurrent_modification',
            conflictingFields: ['price', 'availability'],
            suggestedAction: 'retry_request'
          }
        },
        timestamp: new Date().toISOString()
      });
      return;
    }
    next();
  };
};

// Combined error simulation middleware
export const comprehensiveErrorSimulation = (otaType?: string) => {
  const errorRate = parseInt(process.env['ERROR_SIMULATION_RATE'] || '5');
  
  return [
    simulateRandomErrors(errorRate),
    otaType ? simulateOTAErrors(otaType, errorRate * 0.6) : null,
    simulateWebhookFailures(2),
    simulateDataInconsistency(1)
  ].filter(Boolean);
};

// Realistic API simulation middleware
export const realisticAPISimulation = (otaType?: string) => {
  return [
    simulateRandomErrors(parseInt(process.env['ERROR_SIMULATION_RATE'] || '5')),
    otaType ? simulateOTAErrors(otaType, 3) : null,
    simulateWebhookFailures(2),
    simulateDataInconsistency(1)
  ].filter(Boolean);
};
