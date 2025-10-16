import { Request, Response } from 'express';
import { websocketService } from '../services/websocketService';
import { performanceService } from '../services/performanceService';
import { dataGenerator } from '../services/dataGenerator';
import { logger } from '../config/logger';
import { ApiResponse } from '../types';

class HealthController {
  public getDetailedHealth = async (req: Request, res: Response) => {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: process.env['NODE_ENV'] || 'development',
      services: {
        websocket: websocketService.getHealthStatus(),
        performance: performanceService.getHealthStatus(),
        data: {
          properties: dataGenerator.getData().properties.length,
          bookings: dataGenerator.getData().bookings.length,
          channels: dataGenerator.getData().channels.length,
          ratePlans: dataGenerator.getData().ratePlans.length,
          calendars: dataGenerator.getData().calendars.length
        }
      }
    };
    
    // Determine overall health status
    const isHealthy = 
      healthStatus.services.websocket.isInitialized &&
      healthStatus.services.performance.isHealthy;
    
    healthStatus.status = isHealthy ? 'healthy' : 'unhealthy';
    
    logger.info('Detailed health check completed', { status: healthStatus.status });
    res.json(healthStatus);
  };

  public getReadiness = async (req: Request, res: Response) => {
    const websocketReady = websocketService.getHealthStatus().isInitialized;
    const performanceReady = performanceService.getHealthStatus().isHealthy;
    
    const isReady = websocketReady && performanceReady;
    
    if (isReady) {
      res.json({
        status: 'ready',
        timestamp: new Date().toISOString(),
        services: {
          websocket: websocketReady,
          performance: performanceReady
        }
      });
    } else {
      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        reason: 'One or more services are not ready',
        services: {
          websocket: websocketReady,
          performance: performanceReady
        }
      });
    }
  };

  public getLiveness = async (req: Request, res: Response) => {
    res.json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      pid: process.pid,
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    });
  };

  public getServicesHealth = async (req: Request, res: Response) => {
    const servicesHealth = {
      websocket: websocketService.getHealthStatus(),
      performance: performanceService.getHealthStatus(),
      data: {
        properties: dataGenerator.getData().properties.length,
        bookings: dataGenerator.getData().bookings.length,
        channels: dataGenerator.getData().channels.length,
        ratePlans: dataGenerator.getData().ratePlans.length,
        calendars: dataGenerator.getData().calendars.length
      }
    };
    
    const response: ApiResponse = {
      success: true,
      data: servicesHealth,
      timestamp: new Date().toISOString()
    };
    
    logger.info('Services health check completed');
    res.json(response);
  };
}

export const healthController = new HealthController();


