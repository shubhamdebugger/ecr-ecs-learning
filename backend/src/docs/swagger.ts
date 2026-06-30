import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config/app.config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description:
        'A production-ready URL shortener API with analytics, built with Express.js, TypeScript, and MongoDB.',
      contact: {
        name: 'API Support',
        email: 'support@urlshortener.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `${config.BASE_URL}/api`,
        description: config.NODE_ENV === 'production' ? 'Production' : 'Development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'object' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Url: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            originalUrl: { type: 'string', format: 'uri' },
            shortCode: { type: 'string' },
            customAlias: { type: 'string' },
            title: { type: 'string' },
            shortUrl: { type: 'string', format: 'uri' },
            clicks: { type: 'integer' },
            isActive: { type: 'boolean' },
            expiresAt: { type: 'string', format: 'date-time' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints' },
      { name: 'Users', description: 'User profile management' },
      { name: 'URLs', description: 'URL management endpoints' },
      { name: 'Analytics', description: 'Analytics and reporting' },
      { name: 'Redirect', description: 'URL redirection' },
      { name: 'Health', description: 'System health check' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
