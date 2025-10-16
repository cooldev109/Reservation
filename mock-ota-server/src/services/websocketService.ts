import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { logger } from '../config/logger';
import { WebSocketMessage } from '../types';

export class WebSocketService {
  private static instance: WebSocketService;
  private io: SocketIOServer | null = null;
  private connectedClients: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public initialize(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
    logger.info('WebSocket service initialized');
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);
      this.connectedClients.set(socket.id, {
        socket,
        connectedAt: new Date(),
        subscriptions: new Set()
      });

      // Handle client subscriptions
      socket.on('subscribe', (data: { channel: string; type: string }) => {
        const client = this.connectedClients.get(socket.id);
        if (client) {
          const subscriptionKey = `${data.channel}:${data.type}`;
          client.subscriptions.add(subscriptionKey);
          logger.debug(`Client ${socket.id} subscribed to ${subscriptionKey}`);
          
          socket.emit('subscription_confirmed', {
            channel: data.channel,
            type: data.type,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Handle client unsubscriptions
      socket.on('unsubscribe', (data: { channel: string; type: string }) => {
        const client = this.connectedClients.get(socket.id);
        if (client) {
          const subscriptionKey = `${data.channel}:${data.type}`;
          client.subscriptions.delete(subscriptionKey);
          logger.debug(`Client ${socket.id} unsubscribed from ${subscriptionKey}`);
          
          socket.emit('unsubscription_confirmed', {
            channel: data.channel,
            type: data.type,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Handle ping/pong for connection health
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: new Date().toISOString() });
      });

      // Handle client disconnect
      socket.on('disconnect', (reason) => {
        logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
        this.connectedClients.delete(socket.id);
      });

      // Handle errors
      socket.on('error', (error) => {
        logger.error(`Socket error for client ${socket.id}:`, error);
      });
    });
  }

  public broadcastToChannel(channel: string, message: WebSocketMessage): void {
    if (!this.io) return;

    logger.debug(`Broadcasting to channel ${channel}:`, message);
    
    // Broadcast to all clients subscribed to this channel
    this.connectedClients.forEach((client, socketId) => {
      const subscriptionKey = `${channel}:${message.type}`;
      if (client.subscriptions.has(subscriptionKey)) {
        client.socket.emit('channel_update', message);
      }
    });
  }

  public broadcastToAll(message: WebSocketMessage): void {
    if (!this.io) return;

    logger.debug('Broadcasting to all clients:', message);
    this.io.emit('global_update', message);
  }

  public sendToClient(socketId: string, message: WebSocketMessage): boolean {
    const client = this.connectedClients.get(socketId);
    if (client) {
      client.socket.emit('direct_message', message);
      return true;
    }
    return false;
  }

  public getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  public getConnectedClients(): Array<{ id: string; connectedAt: Date; subscriptions: string[] }> {
    return Array.from(this.connectedClients.entries()).map(([id, client]) => ({
      id,
      connectedAt: client.connectedAt,
      subscriptions: Array.from(client.subscriptions)
    }));
  }

  // Specific broadcast methods for different event types
  public broadcastBookingUpdate(channel: string, bookingData: any): void {
    const message: WebSocketMessage = {
      type: 'booking_update',
      channel,
      data: bookingData,
      timestamp: new Date()
    };
    this.broadcastToChannel(channel, message);
  }

  public broadcastPropertyUpdate(channel: string, propertyData: any): void {
    const message: WebSocketMessage = {
      type: 'property_update',
      channel,
      data: propertyData,
      timestamp: new Date()
    };
    this.broadcastToChannel(channel, message);
  }

  public broadcastRateUpdate(channel: string, rateData: any): void {
    const message: WebSocketMessage = {
      type: 'rate_update',
      channel,
      data: rateData,
      timestamp: new Date()
    };
    this.broadcastToChannel(channel, message);
  }

  public broadcastCalendarUpdate(channel: string, calendarData: any): void {
    const message: WebSocketMessage = {
      type: 'calendar_update',
      channel,
      data: calendarData,
      timestamp: new Date()
    };
    this.broadcastToChannel(channel, message);
  }

  public broadcastWebhookNotification(channel: string, webhookData: any): void {
    const message: WebSocketMessage = {
      type: 'webhook_notification',
      channel,
      data: webhookData,
      timestamp: new Date()
    };
    this.broadcastToChannel(channel, message);
  }

  // Health check method
  public getHealthStatus(): any {
    return {
      isInitialized: this.io !== null,
      connectedClients: this.getConnectedClientsCount(),
      clients: this.getConnectedClients(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }

  // Graceful shutdown
  public shutdown(): void {
    if (this.io) {
      logger.info('Shutting down WebSocket service...');
      this.io.close();
      this.connectedClients.clear();
      this.io = null;
      logger.info('WebSocket service shut down');
    }
  }
}

const websocketService = WebSocketService.getInstance();
export { websocketService };
export default websocketService;
