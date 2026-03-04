import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from './errorHandler';
import { AuthRequest } from '../types';
import { User } from '../models/User';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Missing Bearer token.', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Authentication required. Missing Bearer token.', 401);
    }

    const decoded = verifyAccessToken(token);

    // Optional: Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('User belonging to this token no longer exists.', 401);
    }

    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid token', 401));
    }
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.userId) {
      throw new AppError('Authentication required', 401);
    }

    const user = await User.findById(req.user.userId);

    if (!user || user.role !== 'admin') {
      throw new AppError('Forbidden: Admin access required', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};
