import { userRepository } from '../repositories/user.repository';
import { AppError } from '../middleware/errorHandler';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { redisClient } from '../config/redis';
import { env } from '../config/env';

export class AuthService {
  async register(data: Record<string, any>) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const user = await userRepository.create(data);

    // Convert to plain object to omit password
    const userObject = user.toObject();
    delete userObject.password;

    return { user: userObject };
  }

  async login(data: Record<string, any>) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const payload = { userId: user.id };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Optional: Store refresh token in Redis to track valid sessions
    // Using 7 days in seconds for expiration
    const expirySeconds = 7 * 24 * 60 * 60;
    await redisClient.set(`refresh_token:${user.id}`, refreshToken, 'EX', expirySeconds);

    const userObject = user.toObject();
    delete userObject.password;

    return {
      user: userObject,
      accessToken,
      refreshToken
    };
  }

  async refreshToken(token: string) {
    if (!token) {
      throw new AppError('Refresh token required', 401);
    }

    try {
      const decoded = verifyRefreshToken(token);

      // Verify token matches what's in Redis
      const storedToken = await redisClient.get(`refresh_token:${decoded.userId}`);

      if (!storedToken || storedToken !== token) {
        throw new AppError('Invalid or expired refresh token', 401);
      }

      const payload = { userId: decoded.userId };
      const newAccessToken = generateAccessToken(payload);

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async logout(userId: string) {
    // Revoke refresh token in Redis
    if (userId) {
      await redisClient.del(`refresh_token:${userId}`);
    }
  }
}

export const authService = new AuthService();
