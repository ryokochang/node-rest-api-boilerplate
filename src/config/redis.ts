import { Redis } from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

export const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

export const connectRedis = async (): Promise<void> => {
  try {
    // Basic ping to verify connection
    await redisClient.ping();
  } catch (error) {
    logger.error('Failed to connect to Redis', error);
  }
};
