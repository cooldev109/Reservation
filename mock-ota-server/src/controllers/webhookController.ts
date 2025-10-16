import { Request, Response } from 'express';
import { websocketService } from '../services/websocketService';
import { logger } from '../config/logger';
import { createError } from '../utils/errors';
import { ApiResponse } from '../types';

class WebhookController {
  private webhookQueue: Array<{
    id: string;
    channel: string;
    eventType: string;
    payload: any;
    status: 'pending' | 'processed' | 'failed';
    attempts: number;
    maxAttempts: number;
    nextRetryAt?: Date;
    createdAt: Date;
    processedAt?: Date;
  }> = [];

  public handleAirbnbWebhook = async (req: Request, res: Response) => {
    const { event_type, data, timestamp } = req.body;
    
    if (!event_type || !data) {
      throw createError.validation('event_type and data are required');
    }

    const webhookId = `airbnb_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const webhook = {
      id: webhookId,
      channel: 'airbnb',
      eventType: event_type,
      payload: data,
      status: 'pending' as const,
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date()
    };

    this.webhookQueue.push(webhook);
    
    // Process webhook asynchronously
    this.processWebhook(webhook);
    
    // Broadcast webhook notification via WebSocket
    websocketService.broadcastWebhookNotification('airbnb', {
      eventType: event_type,
      data: data,
      webhookId: webhookId
    });

    const response: ApiResponse = {
      success: true,
      data: {
        webhookId: webhookId,
        status: 'received',
        eventType: event_type
      },
      timestamp: new Date().toISOString()
    };

    logger.info(`Received Airbnb webhook: ${event_type}`, { webhookId, eventType: event_type });
    res.json(response);
  };

  public handleBookingWebhook = async (req: Request, res: Response) => {
    const { event_type, data, timestamp } = req.body;
    
    if (!event_type || !data) {
      throw createError.validation('event_type and data are required');
    }

    const webhookId = `booking_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const webhook = {
      id: webhookId,
      channel: 'booking',
      eventType: event_type,
      payload: data,
      status: 'pending' as const,
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date()
    };

    this.webhookQueue.push(webhook);
    
    // Process webhook asynchronously
    this.processWebhook(webhook);
    
    // Broadcast webhook notification via WebSocket
    websocketService.broadcastWebhookNotification('booking', {
      eventType: event_type,
      data: data,
      webhookId: webhookId
    });

    const response: ApiResponse = {
      success: true,
      data: {
        webhookId: webhookId,
        status: 'received',
        eventType: event_type
      },
      timestamp: new Date().toISOString()
    };

    logger.info(`Received Booking.com webhook: ${event_type}`, { webhookId, eventType: event_type });
    res.json(response);
  };

  public handleExpediaWebhook = async (req: Request, res: Response) => {
    const { event_type, data, timestamp } = req.body;
    
    if (!event_type || !data) {
      throw createError.validation('event_type and data are required');
    }

    const webhookId = `expedia_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const webhook = {
      id: webhookId,
      channel: 'expedia',
      eventType: event_type,
      payload: data,
      status: 'pending' as const,
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date()
    };

    this.webhookQueue.push(webhook);
    
    // Process webhook asynchronously
    this.processWebhook(webhook);
    
    // Broadcast webhook notification via WebSocket
    websocketService.broadcastWebhookNotification('expedia', {
      eventType: event_type,
      data: data,
      webhookId: webhookId
    });

    const response: ApiResponse = {
      success: true,
      data: {
        webhookId: webhookId,
        status: 'received',
        eventType: event_type
      },
      timestamp: new Date().toISOString()
    };

    logger.info(`Received Expedia webhook: ${event_type}`, { webhookId, eventType: event_type });
    res.json(response);
  };

  public handleAgodaWebhook = async (req: Request, res: Response) => {
    const { event_type, data, timestamp } = req.body;
    
    if (!event_type || !data) {
      throw createError.validation('event_type and data are required');
    }

    const webhookId = `agoda_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const webhook = {
      id: webhookId,
      channel: 'agoda',
      eventType: event_type,
      payload: data,
      status: 'pending' as const,
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date()
    };

    this.webhookQueue.push(webhook);
    
    // Process webhook asynchronously
    this.processWebhook(webhook);
    
    // Broadcast webhook notification via WebSocket
    websocketService.broadcastWebhookNotification('agoda', {
      eventType: event_type,
      data: data,
      webhookId: webhookId
    });

    const response: ApiResponse = {
      success: true,
      data: {
        webhookId: webhookId,
        status: 'received',
        eventType: event_type
      },
      timestamp: new Date().toISOString()
    };

    logger.info(`Received Agoda webhook: ${event_type}`, { webhookId, eventType: event_type });
    res.json(response);
  };

  public handleVrboWebhook = async (req: Request, res: Response) => {
    const { event_type, data, timestamp } = req.body;
    
    if (!event_type || !data) {
      throw createError.validation('event_type and data are required');
    }

    const webhookId = `vrbo_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const webhook = {
      id: webhookId,
      channel: 'vrbo',
      eventType: event_type,
      payload: data,
      status: 'pending' as const,
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date()
    };

    this.webhookQueue.push(webhook);
    
    // Process webhook asynchronously
    this.processWebhook(webhook);
    
    // Broadcast webhook notification via WebSocket
    websocketService.broadcastWebhookNotification('vrbo', {
      eventType: event_type,
      data: data,
      webhookId: webhookId
    });

    const response: ApiResponse = {
      success: true,
      data: {
        webhookId: webhookId,
        status: 'received',
        eventType: event_type
      },
      timestamp: new Date().toISOString()
    };

    logger.info(`Received Vrbo webhook: ${event_type}`, { webhookId, eventType: event_type });
    res.json(response);
  };

  public handleTestWebhook = async (req: Request, res: Response) => {
    const { channel, event_type, data } = req.body;
    
    if (!channel || !event_type) {
      throw createError.validation('channel and event_type are required');
    }

    const webhookId = `test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const webhook = {
      id: webhookId,
      channel: channel,
      eventType: event_type,
      payload: data || {},
      status: 'pending' as const,
      attempts: 0,
      maxAttempts: 1,
      createdAt: new Date()
    };

    this.webhookQueue.push(webhook);
    
    // Process webhook asynchronously
    this.processWebhook(webhook);
    
    // Broadcast webhook notification via WebSocket
    websocketService.broadcastWebhookNotification(channel, {
      eventType: event_type,
      data: data || {},
      webhookId: webhookId
    });

    const response: ApiResponse = {
      success: true,
      data: {
        webhookId: webhookId,
        status: 'received',
        eventType: event_type,
        channel: channel
      },
      timestamp: new Date().toISOString()
    };

    logger.info(`Received test webhook: ${event_type} for channel ${channel}`, { webhookId, eventType: event_type, channel });
    res.json(response);
  };

  public getWebhookStatus = async (req: Request, res: Response) => {
    const { channel, status, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    
    let webhooks = [...this.webhookQueue];
    
    // Apply filters
    if (channel) {
      webhooks = webhooks.filter(w => w.channel === channel);
    }
    
    if (status) {
      webhooks = webhooks.filter(w => w.status === status);
    }
    
    // Sort by creation date (newest first)
    webhooks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedWebhooks = webhooks.slice(startIndex, endIndex);
    
    const response: ApiResponse = {
      success: true,
      data: paginatedWebhooks.map(w => ({
        id: w.id,
        channel: w.channel,
        eventType: w.eventType,
        status: w.status,
        attempts: w.attempts,
        maxAttempts: w.maxAttempts,
        createdAt: w.createdAt,
        processedAt: w.processedAt,
        nextRetryAt: w.nextRetryAt
      })),
      meta: {
        total: webhooks.length,
        page: pageNum,
        limit: limitNum,
        hasMore: endIndex < webhooks.length
      },
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Retrieved webhook status: ${paginatedWebhooks.length} webhooks`);
    res.json(response);
  };

  private async processWebhook(webhook: any): Promise<void> {
    try {
      webhook.attempts++;
      webhook.status = 'processed';
      webhook.processedAt = new Date();
      
      // Simulate webhook processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      logger.info(`Processed webhook: ${webhook.id}`, {
        channel: webhook.channel,
        eventType: webhook.eventType,
        attempts: webhook.attempts
      });
      
    } catch (error) {
      webhook.status = 'failed';
      
      if (webhook.attempts < webhook.maxAttempts) {
        webhook.nextRetryAt = new Date(Date.now() + 60000); // Retry in 1 minute
        webhook.status = 'pending';
      }
      
      logger.error(`Failed to process webhook: ${webhook.id}`, {
        channel: webhook.channel,
        eventType: webhook.eventType,
        attempts: webhook.attempts,
        error: error
      });
    }
  }
}

export const webhookController = new WebhookController();


