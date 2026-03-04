import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { env } from './config/env';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';
import { apiRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { globalRateLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.http(message.trim()) },
  })
);

// Apply global rate limiting to all requests
app.use(globalRateLimiter);

// Routes
app.use('/api/v1', apiRoutes);

// Error Handling (Must be last middleware)
app.use(errorHandler);

// Start Server
if (env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      await connectDB();
      await connectRedis();

      const port = env.PORT || 5000;
      app.listen(port, () => {
        logger.info(`Server running in ${env.NODE_ENV} mode on port ${port}`);
        logger.info(`API Docs available at http://localhost:${port}/api/v1/docs`);
      });
    } catch (error) {
      logger.error('Failed to start server', error);
      process.exit(1);
    }
  };

  startServer();
}

export default app;
