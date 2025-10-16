# Reservario Mock OTA Server

A comprehensive Express.js-based mock server that simulates Airbnb, Booking.com, Expedia, Agoda, and Vrbo APIs for the Reservario Channel Manager.

## Features

- ✅ **5 OTA Simulations**: Airbnb, Booking.com, Expedia, Agoda, and Vrbo
- ✅ **Full CRUD Operations**: Properties, Bookings, Rate Plans, and Calendar management
- ✅ **WebSocket Support**: Real-time updates and notifications
- ✅ **Webhook Endpoints**: Simulate real-time OTA notifications
- ✅ **Error Simulation**: Configurable error rates for testing edge cases
- ✅ **Realistic Data Generation**: Using Faker.js for mock data
- ✅ **Rate Limiting**: Simulate API rate limits
- ✅ **Swagger Documentation**: Interactive API documentation
- ✅ **TypeScript**: Full type safety and IntelliSense support
- ✅ **Performance Monitoring**: Track API performance metrics

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The server will start on `http://localhost:3001` (configurable via PORT environment variable).

### Build

```bash
npm run build
npm start
```

### Testing

```bash
npm test
```

## API Documentation

Once the server is running, access the Swagger documentation at:

📚 **http://localhost:3001/api-docs**

## API Endpoints

### Health Check

```
GET /health - Server health status
```

### Airbnb API

```
GET    /api/airbnb/properties          - List properties
POST   /api/airbnb/properties          - Create property
GET    /api/airbnb/properties/:id      - Get property
PUT    /api/airbnb/properties/:id      - Update property
DELETE /api/airbnb/properties/:id      - Delete property

GET    /api/airbnb/bookings            - List bookings
POST   /api/airbnb/bookings            - Create booking
GET    /api/airbnb/bookings/:id        - Get booking
PUT    /api/airbnb/bookings/:id        - Update booking
DELETE /api/airbnb/bookings/:id        - Cancel booking

GET    /api/airbnb/rates               - Get rate plans
POST   /api/airbnb/rates               - Create rate plan

GET    /api/airbnb/calendar            - Get calendar
POST   /api/airbnb/calendar            - Update calendar
```

### Booking.com API

```
GET    /api/booking/properties          - List properties
POST   /api/booking/properties          - Create property
GET    /api/booking/properties/:id      - Get property
PUT    /api/booking/properties/:id      - Update property
DELETE /api/booking/properties/:id      - Delete property

GET    /api/booking/reservations        - List reservations
POST   /api/booking/reservations        - Create reservation
GET    /api/booking/reservations/:id    - Get reservation
PUT    /api/booking/reservations/:id    - Update reservation
DELETE /api/booking/reservations/:id    - Cancel reservation

GET    /api/booking/rates               - Get rate plans
POST   /api/booking/rates               - Create rate plan

GET    /api/booking/availability        - Get availability
POST   /api/booking/availability        - Update availability
```

### Expedia API

```
GET    /api/expedia/properties          - List properties
POST   /api/expedia/properties          - Create property
GET    /api/expedia/properties/:id      - Get property
PUT    /api/expedia/properties/:id      - Update property
DELETE /api/expedia/properties/:id      - Delete property

GET    /api/expedia/bookings            - List bookings
POST   /api/expedia/bookings            - Create booking
GET    /api/expedia/bookings/:id        - Get booking
PUT    /api/expedia/bookings/:id        - Update booking
DELETE /api/expedia/bookings/:id        - Cancel booking

GET    /api/expedia/rates               - Get rate plans
POST   /api/expedia/rates               - Create rate plan

GET    /api/expedia/calendar            - Get calendar
POST   /api/expedia/calendar            - Update calendar
```

### Agoda API

```
GET    /api/agoda/properties          - List properties
POST   /api/agoda/properties          - Create property
GET    /api/agoda/properties/:id      - Get property
PUT    /api/agoda/properties/:id      - Update property
DELETE /api/agoda/properties/:id      - Delete property

GET    /api/agoda/bookings            - List bookings
POST   /api/agoda/bookings            - Create booking
GET    /api/agoda/bookings/:id        - Get booking
PUT    /api/agoda/bookings/:id        - Update booking
DELETE /api/agoda/bookings/:id        - Cancel booking

GET    /api/agoda/rates               - Get rate plans
POST   /api/agoda/rates               - Create rate plan

GET    /api/agoda/calendar            - Get calendar
POST   /api/agoda/calendar            - Update calendar
```

### Vrbo API

```
GET    /api/vrbo/properties          - List properties
POST   /api/vrbo/properties          - Create property
GET    /api/vrbo/properties/:id      - Get property
PUT    /api/vrbo/properties/:id      - Update property
DELETE /api/vrbo/properties/:id      - Delete property

GET    /api/vrbo/bookings            - List bookings
POST   /api/vrbo/bookings            - Create booking
GET    /api/vrbo/bookings/:id        - Get booking
PUT    /api/vrbo/bookings/:id        - Update booking
DELETE /api/vrbo/bookings/:id        - Cancel booking

GET    /api/vrbo/rates               - Get rate plans
POST   /api/vrbo/rates               - Create rate plan

GET    /api/vrbo/calendar            - Get calendar
POST   /api/vrbo/calendar            - Update calendar
```

### Webhook Endpoints

```
POST /api/webhooks/airbnb    - Receive Airbnb webhooks
POST /api/webhooks/booking   - Receive Booking.com webhooks
POST /api/webhooks/expedia   - Receive Expedia webhooks
POST /api/webhooks/agoda     - Receive Agoda webhooks
POST /api/webhooks/vrbo      - Receive Vrbo webhooks
POST /api/webhooks/test      - Test webhook endpoint
GET  /api/webhooks/status    - Get webhook processing status
```

### Metrics

```
GET /api/metrics             - Server performance metrics
```

## Configuration

Configure the server using environment variables in `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `CORS_ORIGIN` | `http://localhost:5173,http://localhost:3000` | Allowed CORS origins |
| `ERROR_SIMULATION_RATE` | `5` | Error simulation rate (%) |
| `WEBHOOK_FAILURE_RATE` | `2` | Webhook failure rate (%) |
| `DATA_INCONSISTENCY_RATE` | `1` | Data inconsistency rate (%) |
| `MOCK_PROPERTIES_COUNT` | `50` | Number of mock properties |
| `MOCK_BOOKINGS_COUNT` | `200` | Number of mock bookings |
| `API_DELAY_MIN` | `100` | Minimum API delay (ms) |
| `API_DELAY_MAX` | `500` | Maximum API delay (ms) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per minute |
| `WEBSOCKET_ENABLED` | `true` | Enable WebSocket |
| `LOG_LEVEL` | `info` | Logging level |

## Error Simulation

The server simulates various error conditions for testing:

### Error Types

- **Authentication Errors** (401): Invalid credentials, expired tokens
- **Authorization Errors** (403): Insufficient permissions
- **Validation Errors** (400): Invalid request parameters
- **Not Found Errors** (404): Resource not found
- **Conflict Errors** (409): Duplicate bookings, data conflicts
- **Rate Limit Errors** (429): Too many requests
- **Server Errors** (500): Internal server errors
- **Service Unavailable** (503): Service downtime

### OTA-Specific Errors

Each OTA has specific error simulations:

- **Airbnb**: API maintenance, temporary unavailability
- **Booking.com**: Rate limit exceeded
- **Expedia**: Authentication failures
- **Agoda**: Validation errors
- **Vrbo**: Service downtime

### Webhook Failures

Simulates webhook delivery failures with automatic retry logic.

### Data Inconsistency

Simulates concurrent modification conflicts.

## WebSocket Support

Real-time updates via WebSocket for:

- Property updates
- Booking changes
- Rate plan modifications
- Calendar updates
- Webhook notifications

Connect to WebSocket at: `ws://localhost:3001`

## Request & Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "hasMore": true
  },
  "timestamp": "2025-10-09T12:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  },
  "timestamp": "2025-10-09T12:00:00.000Z",
  "path": "/api/airbnb/properties"
}
```

## Rate Limiting

- **General Endpoints**: 100 requests per minute per IP
- **Webhook Endpoints**: 50 requests per minute per IP
- Speed limiting with progressive delays

## Testing

The server includes comprehensive testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Development Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Run production server
npm run type-check   # TypeScript type checking
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check formatting
npm run clean        # Clean dist directory
```

## Project Structure

```
mock-ota-server/
├── src/
│   ├── app.ts                      # Express app setup
│   ├── config/
│   │   ├── logger.ts               # Winston logger configuration
│   │   └── swagger.ts              # Swagger/OpenAPI documentation
│   ├── controllers/
│   │   ├── airbnbController.ts     # Airbnb API handlers
│   │   ├── bookingController.ts    # Booking.com API handlers
│   │   ├── expediaController.ts    # Expedia API handlers
│   │   ├── agodaController.ts      # Agoda API handlers
│   │   ├── vrboController.ts       # Vrbo API handlers
│   │   ├── webhookController.ts    # Webhook handlers
│   │   ├── healthController.ts     # Health check handlers
│   │   └── metricsController.ts    # Metrics handlers
│   ├── middleware/
│   │   ├── delay.ts                # Network delay simulation
│   │   ├── errorSimulation.ts      # Error simulation
│   │   └── rateLimiting.ts         # Rate limiting
│   ├── routes/
│   │   ├── airbnbRoutes.ts         # Airbnb routes
│   │   ├── bookingRoutes.ts        # Booking.com routes
│   │   ├── expediaRoutes.ts        # Expedia routes
│   │   ├── agodaRoutes.ts          # Agoda routes
│   │   ├── vrboRoutes.ts           # Vrbo routes
│   │   ├── webhookRoutes.ts        # Webhook routes
│   │   ├── healthRoutes.ts         # Health routes
│   │   └── metricsRoutes.ts        # Metrics routes
│   ├── services/
│   │   ├── dataGenerator.ts        # Mock data generation with Faker.js
│   │   ├── websocketService.ts     # WebSocket service
│   │   └── performanceService.ts   # Performance monitoring
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   └── utils/
│       └── errors.ts               # Error utilities
├── tests/                          # Test files
├── dist/                           # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## Architecture

The mock server follows a clean architecture pattern:

1. **Routes**: Define API endpoints and apply middleware
2. **Controllers**: Handle request/response logic
3. **Services**: Business logic and data management
4. **Middleware**: Cross-cutting concerns (auth, errors, rate limiting)
5. **Utils**: Helper functions and utilities

## Performance Monitoring

Track server performance with built-in metrics:

- Request count (success/failure)
- Response times
- Error rates
- Uptime statistics

Access metrics at: `http://localhost:3001/api/metrics`

## Integration with Reservario

The mock OTA server is designed to work seamlessly with the Reservario Channel Manager:

1. **Development**: Use for local development and testing
2. **Testing**: Comprehensive error simulation for edge case testing
3. **CI/CD**: Automated testing in CI/CD pipelines
4. **Demo**: Showcase channel manager features without real OTA connections

## Migration to Real OTAs

When ready to connect to real OTAs:

1. Update environment variables with real API credentials
2. Replace mock endpoints with real OTA API endpoints
3. The abstraction layer in Reservario makes this seamless

## Contributing

Follow the development rules defined in `rule.md`:

- TypeScript with strict configuration
- ESLint and Prettier for code quality
- Comprehensive error handling
- Input validation
- Clear documentation

## License

MIT

## Support

For issues and questions, refer to the main Reservario documentation.

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Status**: Production Ready
