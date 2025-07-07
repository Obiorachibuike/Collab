import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
    
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CollabBoard API',
      version: '1.0.0',
      description: 'API documentation for the Real-Time Collaborative Kanban Board project',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Swagger comments live here
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };