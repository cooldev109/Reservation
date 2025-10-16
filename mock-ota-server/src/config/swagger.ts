import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Reservario Mock OTA Server API',
      version: '1.0.0',
      description: 'Mock API server that simulates various OTA (Online Travel Agency) APIs including Airbnb, Booking.com, Expedia, Agoda, and Vrbo for testing and development purposes.',
      contact: {
        name: 'Reservario Support',
        url: 'http://www.reservario.com/support',
        email: 'support@reservario.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Development server',
      },
      {
        url: 'https://mock-ota.reservario.com/api',
        description: 'Production mock server',
      },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API Key for authentication',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Bearer token for authentication',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                },
                message: {
                  type: 'string',
                  example: 'Invalid request parameters',
                },
                details: {
                  type: 'object',
                  example: { field: 'propertyId' },
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            path: {
              type: 'string',
              example: '/api/airbnb/properties',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
            },
            meta: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  example: 100,
                },
                page: {
                  type: 'integer',
                  example: 1,
                },
                limit: {
                  type: 'integer',
                  example: 20,
                },
                hasMore: {
                  type: 'boolean',
                  example: true,
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Property: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'prop_123456789',
            },
            name: {
              type: 'string',
              example: 'Beautiful Downtown Apartment',
            },
            description: {
              type: 'string',
              example: 'A stunning apartment in the heart of the city...',
            },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string', example: '123 Main St' },
                city: { type: 'string', example: 'New York' },
                state: { type: 'string', example: 'NY' },
                country: { type: 'string', example: 'USA' },
                postalCode: { type: 'string', example: '10001' },
                coordinates: {
                  type: 'object',
                  properties: {
                    lat: { type: 'number', example: 40.7128 },
                    lng: { type: 'number', example: -74.0060 },
                  },
                },
              },
            },
            amenities: {
              type: 'array',
              items: { type: 'string' },
              example: ['wifi', 'parking', 'pool', 'gym'],
            },
            images: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://example.com/image1.jpg'],
            },
            maxGuests: {
              type: 'integer',
              example: 4,
            },
            bedrooms: {
              type: 'integer',
              example: 2,
            },
            bathrooms: {
              type: 'integer',
              example: 1,
            },
            propertyType: {
              type: 'string',
              example: 'apartment',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'maintenance'],
              example: 'active',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'booking_123456789',
            },
            propertyId: {
              type: 'string',
              example: 'prop_123456789',
            },
            guestId: {
              type: 'string',
              example: 'guest_123456789',
            },
            guestName: {
              type: 'string',
              example: 'John Doe',
            },
            guestEmail: {
              type: 'string',
              example: 'john.doe@example.com',
            },
            checkIn: {
              type: 'string',
              format: 'date',
              example: '2024-01-15',
            },
            checkOut: {
              type: 'string',
              format: 'date',
              example: '2024-01-20',
            },
            guests: {
              type: 'integer',
              example: 2,
            },
            totalAmount: {
              type: 'number',
              example: 750.00,
            },
            currency: {
              type: 'string',
              example: 'USD',
            },
            status: {
              type: 'string',
              enum: ['confirmed', 'cancelled', 'completed', 'pending'],
              example: 'confirmed',
            },
            channel: {
              type: 'string',
              enum: ['airbnb', 'booking', 'expedia', 'agoda', 'vrbo'],
              example: 'airbnb',
            },
            channelBookingId: {
              type: 'string',
              example: 'AIRBNB123456',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        RatePlan: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'rate_123456789',
            },
            propertyId: {
              type: 'string',
              example: 'prop_123456789',
            },
            name: {
              type: 'string',
              example: 'Standard Rate',
            },
            basePrice: {
              type: 'number',
              example: 150.00,
            },
            currency: {
              type: 'string',
              example: 'USD',
            },
            minStay: {
              type: 'integer',
              example: 2,
            },
            maxStay: {
              type: 'integer',
              example: 30,
            },
            cancellationPolicy: {
              type: 'string',
              enum: ['flexible', 'moderate', 'strict', 'super_strict'],
              example: 'moderate',
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            validFrom: {
              type: 'string',
              format: 'date',
            },
            validTo: {
              type: 'string',
              format: 'date',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Calendar: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cal_123456789',
            },
            propertyId: {
              type: 'string',
              example: 'prop_123456789',
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2024-01-15',
            },
            isAvailable: {
              type: 'boolean',
              example: true,
            },
            price: {
              type: 'number',
              example: 150.00,
            },
            minStay: {
              type: 'integer',
              example: 2,
            },
            maxStay: {
              type: 'integer',
              example: 30,
            },
            restrictions: {
              type: 'array',
              items: { type: 'string' },
              example: ['no_pets', 'no_smoking'],
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    security: [
      {
        apiKey: [],
      },
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.ts', // Path to the API routes files
    './src/controllers/*.ts', // Path to controllers for additional JSDoc
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export default swaggerDocs;


