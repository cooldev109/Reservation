import { Request, Response } from 'express';
import { performanceService } from '../services/performanceService';
import { logger } from '../config/logger';
import { createError } from '../utils/errors';
import { ApiResponse } from '../types';

class MetricsController {
  public getPerformanceMetrics = async (req: Request, res: Response) => {
    const metrics = performanceService.getMetrics();
    
    const response: ApiResponse = {
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    };
    
    logger.info('Performance metrics retrieved');
    res.json(response);
  };

  public getDetailedMetrics = async (req: Request, res: Response) => {
    const detailedMetrics = performanceService.getDetailedMetrics();
    
    const response: ApiResponse = {
      success: true,
      data: detailedMetrics,
      timestamp: new Date().toISOString()
    };
    
    logger.info('Detailed performance metrics retrieved');
    res.json(response);
  };

  public getMetricsHealth = async (req: Request, res: Response) => {
    const healthStatus = performanceService.getHealthStatus();
    
    const response: ApiResponse = {
      success: true,
      data: healthStatus,
      timestamp: new Date().toISOString()
    };
    
    logger.info('Metrics health status retrieved');
    res.json(response);
  };

  public resetMetrics = async (req: Request, res: Response) => {
    performanceService.resetMetrics();
    
    const response: ApiResponse = {
      success: true,
      data: {
        message: 'Performance metrics reset successfully',
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
    
    logger.info('Performance metrics reset');
    res.json(response);
  };

  public simulateLoad = async (req: Request, res: Response) => {
    const { duration = 60000, requestsPerSecond = 10 } = req.body;
    
    if (typeof duration !== 'number' || duration <= 0) {
      throw createError.validation('Duration must be a positive number');
    }
    
    if (typeof requestsPerSecond !== 'number' || requestsPerSecond <= 0) {
      throw createError.validation('Requests per second must be a positive number');
    }
    
    if (duration > 300000) { // 5 minutes max
      throw createError.validation('Duration cannot exceed 5 minutes (300000ms)');
    }
    
    if (requestsPerSecond > 100) { // 100 RPS max
      throw createError.validation('Requests per second cannot exceed 100');
    }
    
    // Start load simulation
    performanceService.simulateLoad(duration, requestsPerSecond);
    
    const response: ApiResponse = {
      success: true,
      data: {
        message: 'Load simulation started',
        duration: duration,
        requestsPerSecond: requestsPerSecond,
        estimatedTotalRequests: Math.floor((duration / 1000) * requestsPerSecond)
      },
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Load simulation started: ${requestsPerSecond} RPS for ${duration}ms`);
    res.json(response);
  };
}

export const metricsController = new MetricsController();


