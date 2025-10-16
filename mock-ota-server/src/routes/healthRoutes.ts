import { Router } from 'express';
import { healthController } from '../controllers/healthController';
import { asyncHandler } from '../utils/errors';

const router = Router();

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Get detailed health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 3600
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 environment:
 *                   type: string
 *                   example: "development"
 *                 services:
 *                   type: object
 *                   properties:
 *                     websocket:
 *                       type: object
 *                     performance:
 *                       type: object
 *                     data:
 *                       type: object
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/detailed', asyncHandler(healthController.getDetailedHealth));

/**
 * @swagger
 * /health/readiness:
 *   get:
 *     summary: Check if service is ready to accept requests
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ready"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       503:
 *         description: Service is not ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "not_ready"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 reason:
 *                   type: string
 *                   example: "Initializing services"
 */
router.get('/readiness', asyncHandler(healthController.getReadiness));

/**
 * @swagger
 * /health/liveness:
 *   get:
 *     summary: Check if service is alive
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "alive"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 3600
 */
router.get('/liveness', asyncHandler(healthController.getLiveness));

/**
 * @swagger
 * /health/services:
 *   get:
 *     summary: Get individual service health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 websocket:
 *                   type: object
 *                   properties:
 *                     isInitialized:
 *                       type: boolean
 *                     connectedClients:
 *                       type: integer
 *                     uptime:
 *                       type: number
 *                 performance:
 *                   type: object
 *                   properties:
 *                     isHealthy:
 *                       type: boolean
 *                     status:
 *                       type: string
 *                     metrics:
 *                       type: object
 *                 data:
 *                   type: object
 *                   properties:
 *                     properties:
 *                       type: integer
 *                     bookings:
 *                       type: integer
 *                     channels:
 *                       type: integer
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/services', asyncHandler(healthController.getServicesHealth));

export default router;


