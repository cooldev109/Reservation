import { Router } from 'express';
import { metricsController } from '../controllers/metricsController';
import { asyncHandler } from '../utils/errors';

const router = Router();

/**
 * @swagger
 * /metrics/performance:
 *   get:
 *     summary: Get performance metrics
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Performance metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRequests:
 *                       type: integer
 *                       example: 1000
 *                     successfulRequests:
 *                       type: integer
 *                       example: 950
 *                     failedRequests:
 *                       type: integer
 *                       example: 50
 *                     averageResponseTime:
 *                       type: number
 *                       example: 150.5
 *                     requestsPerSecond:
 *                       type: number
 *                       example: 10.5
 *                     errorRate:
 *                       type: number
 *                       example: 5.0
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/performance', asyncHandler(metricsController.getPerformanceMetrics));

/**
 * @swagger
 * /metrics/detailed:
 *   get:
 *     summary: Get detailed performance metrics
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Detailed performance metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRequests:
 *                       type: integer
 *                     successfulRequests:
 *                       type: integer
 *                     failedRequests:
 *                       type: integer
 *                     averageResponseTime:
 *                       type: number
 *                     requestsPerSecond:
 *                       type: number
 *                     errorRate:
 *                       type: number
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *                     detailed:
 *                       type: object
 *                       properties:
 *                         requestsPerMinute:
 *                           type: integer
 *                         requestsPerFiveMinutes:
 *                           type: integer
 *                         requestsPerHour:
 *                           type: integer
 *                         responseTimeStats:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: number
 *                             max:
 *                               type: number
 *                             average:
 *                               type: number
 *                             p50:
 *                               type: number
 *                             p95:
 *                               type: number
 *                             p99:
 *                               type: number
 *                         uptime:
 *                           type: number
 *                         memoryUsage:
 *                           type: object
 *                         cpuUsage:
 *                           type: object
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/detailed', asyncHandler(metricsController.getDetailedMetrics));

/**
 * @swagger
 * /metrics/health:
 *   get:
 *     summary: Get metrics health status
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Metrics health status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     isHealthy:
 *                       type: boolean
 *                       example: true
 *                     status:
 *                       type: string
 *                       example: "healthy"
 *                     metrics:
 *                       type: object
 *                     thresholds:
 *                       type: object
 *                       properties:
 *                         maxErrorRate:
 *                           type: number
 *                           example: 10
 *                         maxResponseTime:
 *                           type: number
 *                           example: 2000
 *                         minRequestsPerSecond:
 *                           type: number
 *                           example: 0.1
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/health', asyncHandler(metricsController.getMetricsHealth));

/**
 * @swagger
 * /metrics/reset:
 *   post:
 *     summary: Reset performance metrics
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Metrics reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Performance metrics reset successfully"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/reset', asyncHandler(metricsController.resetMetrics));

/**
 * @swagger
 * /metrics/simulate-load:
 *   post:
 *     summary: Simulate load for testing
 *     tags: [Metrics]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               duration:
 *                 type: integer
 *                 default: 60000
 *                 description: "Duration in milliseconds"
 *               requestsPerSecond:
 *                 type: number
 *                 default: 10
 *                 description: "Number of requests per second"
 *     responses:
 *       200:
 *         description: Load simulation started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Load simulation started"
 *                 data:
 *                   type: object
 *                   properties:
 *                     duration:
 *                       type: integer
 *                     requestsPerSecond:
 *                       type: number
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/simulate-load', asyncHandler(metricsController.simulateLoad));

export default router;


