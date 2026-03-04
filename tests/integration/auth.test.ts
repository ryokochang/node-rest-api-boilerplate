import request from 'supertest';
import app from '../../src/app';
import { userRepository } from '../../src/repositories/user.repository';

// Mock the repository to return a dummy user for integration tests
jest.mock('../../src/repositories/user.repository', () => ({
  userRepository: {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
}));

describe('Auth API Integration', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        toObject: () => ({ id: '123', name: 'Test User', email: 'test@example.com' })
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValueOnce(null);
      (userRepository.create as jest.Mock).mockResolvedValueOnce(mockUser);

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'T', // Too short
          email: 'invalid-email',
          password: 'pass', // Too short
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation Error');
    });
  });
});
