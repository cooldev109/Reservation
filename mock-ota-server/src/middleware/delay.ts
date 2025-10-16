import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

// Middleware to simulate API response delays
export const simulateDelay = (minDelay: number = 50, maxDelay: number = 500) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    
    logger.debug(`Simulating ${delay}ms delay for ${req.method} ${req.originalUrl}`);
    
    setTimeout(() => {
      next();
    }, delay);
  };
};

// Middleware to simulate OTA-specific delays
export const simulateOTADelay = (otaType: string) => {
  const delays: { [key: string]: { min: number; max: number } } = {
    airbnb: { min: 100, max: 300 },
    booking: { min: 150, max: 400 },
    expedia: { min: 200, max: 500 },
    agoda: { min: 120, max: 350 },
    vrbo: { min: 180, max: 450 }
  };

  const delayConfig = delays[otaType] || { min: 100, max: 300 };
  
  return simulateDelay(delayConfig.min, delayConfig.max);
};

// Middleware to simulate network latency
export const simulateNetworkLatency = (req: Request, res: Response, next: NextFunction) => {
  const baseLatency = 50; // Base latency in ms
  const jitter = Math.random() * 100; // Random jitter up to 100ms
  const delay = baseLatency + jitter;
  
  logger.debug(`Simulating network latency: ${delay.toFixed(2)}ms`);
  
  setTimeout(() => {
    next();
  }, delay);
};

// Middleware to simulate occasional timeouts
export const simulateTimeout = (timeoutRate: number = 1) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (Math.random() * 100 < timeoutRate) {
      logger.warn(`Simulating timeout for ${req.method} ${req.originalUrl}`);
      // Don't call next() to simulate a timeout
      return;
    }
    next();
  };
};

// Middleware to simulate intermittent connectivity issues
export const simulateConnectivityIssues = (failureRate: number = 0.5) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (Math.random() * 100 < failureRate) {
      logger.warn(`Simulating connectivity issue for ${req.method} ${req.originalUrl}`);
      res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Service temporarily unavailable due to connectivity issues',
          details: { retryAfter: 30 }
        },
        timestamp: new Date().toISOString()
      });
      return;
    }
    next();
  };
};

// Middleware to add realistic response headers
export const addRealisticHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Add common API response headers
  res.set({
    'X-API-Version': '1.0.0',
    'X-Response-Time': Date.now().toString(),
    'X-Request-ID': Math.random().toString(36).substring(7),
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  next();
};

// Middleware to simulate rate limit headers
export const simulateRateLimitHeaders = (req: Request, res: Response, next: NextFunction) => {
  const remaining = Math.floor(Math.random() * 1000);
  const reset = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
  
  res.set({
    'X-RateLimit-Limit': '1000',
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.floor(reset.getTime() / 1000).toString()
  });
  
  next();
};

// Combined middleware for realistic API simulation
export const realisticAPISimulation = (otaType?: string) => {
  return [
    addRealisticHeaders,
    simulateRateLimitHeaders,
    simulateNetworkLatency,
    otaType ? simulateOTADelay(otaType) : simulateDelay(),
    simulateTimeout(0.1), // 0.1% chance of timeout
    simulateConnectivityIssues(0.05) // 0.05% chance of connectivity issues
  ];
};


