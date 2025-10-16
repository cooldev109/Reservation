import { Router } from 'express';
import { webhookController } from '../controllers/webhookController';
import { asyncHandler } from '../utils/errors';

const router = Router();

/**
 * @swagger
 * /webhooks/airbnb:
 *   post:
 *     summary: Receive Airbnb webhook notifications
 *     tags: [Webhooks]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_type:
 *                 type: string
 *                 example: "booking.created"
 *               data:
 *                 type: object
 *                 description: "Event data payload"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/airbnb', asyncHandler(webhookController.handleAirbnbWebhook));

/**
 * @swagger
 * /webhooks/booking:
 *   post:
 *     summary: Receive Booking.com webhook notifications
 *     tags: [Webhooks]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_type:
 *                 type: string
 *                 example: "reservation.created"
 *               data:
 *                 type: object
 *                 description: "Event data payload"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/booking', asyncHandler(webhookController.handleBookingWebhook));

/**
 * @swagger
 * /webhooks/expedia:
 *   post:
 *     summary: Receive Expedia webhook notifications
 *     tags: [Webhooks]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_type:
 *                 type: string
 *                 example: "booking.updated"
 *               data:
 *                 type: object
 *                 description: "Event data payload"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/expedia', asyncHandler(webhookController.handleExpediaWebhook));

/**
 * @swagger
 * /webhooks/agoda:
 *   post:
 *     summary: Receive Agoda webhook notifications
 *     tags: [Webhooks]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_type:
 *                 type: string
 *                 example: "booking.cancelled"
 *               data:
 *                 type: object
 *                 description: "Event data payload"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/agoda', asyncHandler(webhookController.handleAgodaWebhook));

/**
 * @swagger
 * /webhooks/vrbo:
 *   post:
 *     summary: Receive Vrbo webhook notifications
 *     tags: [Webhooks]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_type:
 *                 type: string
 *                 example: "property.updated"
 *               data:
 *                 type: object
 *                 description: "Event data payload"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/vrbo', asyncHandler(webhookController.handleVrboWebhook));

/**
 * @swagger
 * /webhooks/test:
 *   post:
 *     summary: Test webhook endpoint
 *     tags: [Webhooks]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channel:
 *                 type: string
 *                 enum: [airbnb, booking, expedia, agoda, vrbo]
 *                 example: "airbnb"
 *               event_type:
 *                 type: string
 *                 example: "test.event"
 *               data:
 *                 type: object
 *                 description: "Test event data"
 *     responses:
 *       200:
 *         description: Test webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/test', asyncHandler(webhookController.handleTestWebhook));

/**
 * @swagger
 * /webhooks/status:
 *   get:
 *     summary: Get webhook processing status
 *     tags: [Webhooks]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: query
 *         name: channel
 *         schema:
 *           type: string
 *           enum: [airbnb, booking, expedia, agoda, vrbo]
 *         description: Filter by channel
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processed, failed]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of webhooks per page
 *     responses:
 *       200:
 *         description: Webhook status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           channel:
 *                             type: string
 *                           eventType:
 *                             type: string
 *                           status:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           processedAt:
 *                             type: string
 *                             format: date-time
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/status', asyncHandler(webhookController.getWebhookStatus));

export default router;


