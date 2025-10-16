import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { createError } from '../utils/errors';

// Helper to get client IP
const getIp = (req: Request) => req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

// Trusted IPs that bypass rate limits (e.g., internal services, admin IPs)
const trustedIps = (process.env['TRUSTED_IPS'] || '').split(',').map(ip => ip.trim()).filter(Boolean);

// Middleware to check if IP is trusted
export const createTrustedIPRateLimit = (handler: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = getIp(req);
    if (trustedIps.includes(ip as string)) {
      logger.debug(`Trusted IP ${ip} bypassing rate limit.`);
      return next();
    }
    return handler(req, res, next);
  };
};

// General rate limiting for all API endpoints
export const generalRateLimit = createTrustedIPRateLimit(rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), // 15 minutes
  max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '1000'), // limit each IP to 1000 requests per windowMs
  message: createError.rateLimit('Too many requests from this IP, please try again after 15 minutes.'),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction, options: any) => {
    logger.warn(`General rate limit exceeded for IP: ${getIp(req)}`);
    res.status(options.statusCode).send(options.message);
  }
}));

// Rate limiting for OTA API endpoints (more restrictive)
export const otaApiRateLimit = createTrustedIPRateLimit(rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), // 15 minutes
  max: parseInt(process.env['OTA_RATE_LIMIT_MAX_REQUESTS'] || '500'), // limit each IP to 500 requests per windowMs
  message: createError.rateLimit('Too many OTA API requests from this IP, please try again after 15 minutes.'),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction, options: any) => {
    logger.warn(`OTA API rate limit exceeded for IP: ${getIp(req)}`);
    res.status(options.statusCode).send(options.message);
  }
}));

// Rate limiting for webhook endpoints
export const webhookRateLimit = createTrustedIPRateLimit(rateLimit({
  windowMs: parseInt(process.env['WEBHOOK_RATE_LIMIT_WINDOW_MS'] || '60000'), // 1 minute
  max: parseInt(process.env['WEBHOOK_RATE_LIMIT_MAX_REQUESTS'] || '100'), // limit each IP to 100 requests per minute
  message: createError.rateLimit('Too many webhook requests from this IP, please try again after 1 minute.'),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction, options: any) => {
    logger.warn(`Webhook rate limit exceeded for IP: ${getIp(req)}`);
    res.status(options.statusCode).send(options.message);
  }
}));

// Slow down middleware for repeated requests
export const speedLimiter: any = slowDown({
  windowMs: parseInt(process.env['SPEED_LIMIT_WINDOW_MS'] || '900000'), // 15 minutes
  delayAfter: parseInt(process.env['SPEED_LIMIT_DELAY_AFTER'] || '100'), // allow 100 requests per 15 minutes, then...
  delayMs: parseInt(process.env['SPEED_LIMIT_DELAY_MS'] || '200'), // begin adding 200ms of delay per request above 100
  maxDelayMs: parseInt(process.env['SPEED_LIMIT_MAX_DELAY_MS'] || '10000') // max delay of 10 seconds
});

// Custom rate limiting for specific OTA channels
export const createOTAChannelRateLimit = (channel: string, maxRequests: number = 100) => {
  return createTrustedIPRateLimit(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: maxRequests,
    message: createError.rateLimit(`Too many ${channel} API requests, please try again after 15 minutes.`),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
      // Use channel-specific key for rate limiting
      return `${channel}-${getIp(req)}`;
    },
    handler: (req: Request, res: Response, next: NextFunction, options: any) => {
      logger.warn(`${channel} API rate limit exceeded for IP: ${getIp(req)}`);
      res.status(options.statusCode).send(options.message);
    }
  }));
};

// Rate limiting for specific OTA channels
export const airbnbRateLimit = createOTAChannelRateLimit('airbnb', 200);
export const bookingRateLimit = createOTAChannelRateLimit('booking', 300);
export const expediaRateLimit = createOTAChannelRateLimit('expedia', 150);
export const agodaRateLimit = createOTAChannelRateLimit('agoda', 250);
export const vrboRateLimit = createOTAChannelRateLimit('vrbo', 180);

// Custom rate limiting for specific endpoints
export const createCustomRateLimit = (windowMs: number, max: number, message: string, keyGenerator?: (req: Request) => string) => {
  return rateLimit({
    windowMs,
    max,
    message: createError.rateLimit(message),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: keyGenerator || ((req: Request) => getIp(req) as string),
    handler: (req: Request, res: Response, next: NextFunction, options: any) => {
      logger.warn(`Custom rate limit exceeded for IP: ${getIp(req)}`);
      res.status(options.statusCode).send(options.message);
    }
  });
};

const rateLimitingMiddleware: any = {
  generalRateLimit,
  otaApiRateLimit,
  webhookRateLimit,
  speedLimiter,
  airbnbRateLimit,
  bookingRateLimit,
  expediaRateLimit,
  agodaRateLimit,
  vrboRateLimit,
  skipRateLimit: (req: Request, res: Response, next: NextFunction) => next(), // Middleware to skip rate limiting
  createCustomRateLimit,
  createTrustedIPRateLimit,
  createOTAChannelRateLimit
};

export default rateLimitingMiddleware;


