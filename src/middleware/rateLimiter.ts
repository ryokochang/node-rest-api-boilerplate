import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis';
import { env } from '../config/env';

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  store: new RedisStore({
    // @ts-expect-error - Expected given ioredis type definitions mismatch with rate-limit-redis
    sendCommand: (...args: string[]) => redisClient.call(...args),
  }),
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window (stricter for auth)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
  store: new RedisStore({
    // @ts-expect-error - Expected given ioredis type definitions mismatch
    sendCommand: (...args: string[]) => redisClient.call(...args),
  }),
});
