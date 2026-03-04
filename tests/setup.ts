import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env.example') });

// Mock Redis to prevent real connections during tests
jest.mock('ioredis', () => {
  return {
    Redis: jest.fn().mockImplementation(() => {
      return {
        on: jest.fn(),
        ping: jest.fn().mockResolvedValue('PONG'),
        set: jest.fn().mockResolvedValue('OK'),
        get: jest.fn().mockResolvedValue(null),
        del: jest.fn().mockResolvedValue(1),
        call: jest.fn(),
      };
    }),
  };
});

// Mock mongoose to prevent real DB connection in unit tests
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue({ connection: { host: 'localhost' } }),
  };
});

// Mock rate-limit-redis
jest.mock('rate-limit-redis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      increment: jest.fn().mockResolvedValue({ totalHits: 1, resetTime: new Date() }),
      decrement: jest.fn(),
      resetKey: jest.fn(),
    };
  });
});
