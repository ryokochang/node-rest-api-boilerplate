import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// Swagger Setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node REST API Boilerplate',
      version: '1.0.0',
      description: 'API Documentation for Node.js REST API Boilerplate',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Current API version',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Generate docs from comments in routes
};

const specs = swaggerJsdoc(options);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Serve OpenAPI JSON as well
router.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

export const apiRoutes = router;
