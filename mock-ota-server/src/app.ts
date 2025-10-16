import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { logger } from './config/logger';
import { errorHandler } from './utils/errors';
import rateLimitingMiddleware from './middleware/rateLimiting';
import { realisticAPISimulation, comprehensiveErrorSimulation } from './middleware/errorSimulation';
import { performanceService } from './services/performanceService';
import { websocketService } from './services/websocketService';
import { dataGenerator } from './services/dataGenerator';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swagger';

// Import route handlers
import airbnbRoutes from './routes/airbnbRoutes';
import bookingRoutes from './routes/bookingRoutes';
import expediaRoutes from './routes/expediaRoutes';
import agodaRoutes from './routes/agodaRoutes';
import vrboRoutes from './routes/vrboRoutes';
import webhookRoutes from './routes/webhookRoutes';
import healthRoutes from './routes/healthRoutes';
import metricsRoutes from './routes/metricsRoutes';

const app: Application = express();
const server = createServer(app);
const PORT = process.env['PORT'] || 3001;
const NODE_ENV = process.env['NODE_ENV'] || 'development';

// Initialize services
websocketService.initialize(server);

// Initialize mock data
if (NODE_ENV === 'development') {
  dataGenerator.generateBulkData({
    properties: parseInt(process.env['MOCK_PROPERTIES_COUNT'] || '50'),
    bookings: parseInt(process.env['MOCK_BOOKINGS_COUNT'] || '200'),
    ratePlans: 100,
    calendars: 1000
  });
  logger.info('Mock data generated successfully');
}

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const corsOptions = {
  origin: process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Request-ID'],
  credentials: true
};
app.use(cors(corsOptions));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Logging middleware
app.use(morgan('combined', { 
  stream: { 
    write: (message) => logger.info(message.trim()) 
  } 
}));

// Performance monitoring middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const success = res.statusCode >= 200 && res.statusCode < 400;
    performanceService.recordRequest(success, responseTime);
  });
  
  next();
});

// Rate limiting
app.use(rateLimitingMiddleware.generalRateLimit);
app.use(rateLimitingMiddleware.speedLimiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/api-docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: NODE_ENV,
    services: {
      websocket: websocketService.getHealthStatus(),
      performance: performanceService.getHealthStatus(),
      data: {
        properties: dataGenerator.getData().properties.length,
        bookings: dataGenerator.getData().bookings.length,
        channels: dataGenerator.getData().channels.length
      }
    }
  };
  
  res.status(200).json(healthStatus);
});

// API Routes with realistic simulation
app.use('/api/airbnb', 
  realisticAPISimulation('airbnb'),
  comprehensiveErrorSimulation('airbnb'),
  airbnbRoutes
);

app.use('/api/booking', 
  realisticAPISimulation('booking'),
  comprehensiveErrorSimulation('booking'),
  bookingRoutes
);

app.use('/api/expedia', 
  realisticAPISimulation('expedia'),
  comprehensiveErrorSimulation('expedia'),
  expediaRoutes
);

app.use('/api/agoda', 
  realisticAPISimulation('agoda'),
  comprehensiveErrorSimulation('agoda'),
  agodaRoutes
);

app.use('/api/vrbo', 
  realisticAPISimulation('vrbo'),
  comprehensiveErrorSimulation('vrbo'),
  vrboRoutes
);

app.use('/api/webhooks', 
  rateLimitingMiddleware.webhookRateLimit,
  webhookRoutes
);

app.use('/api/health', healthRoutes);
app.use('/api/metrics', metricsRoutes);

// Error handling middleware
app.use(errorHandler);

// Catch-all for undefined routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'Route not found',
      details: { path: _req.originalUrl }
    },
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  websocketService.shutdown();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  websocketService.shutdown();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Start the server
if (NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    logger.info(`Mock OTA Server running on port ${PORT} in ${NODE_ENV} mode`);
    logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
    logger.info(`Health check available at http://localhost:${PORT}/health`);
    logger.info(`WebSocket service running on port ${PORT}`);
  });
}

export default app;


