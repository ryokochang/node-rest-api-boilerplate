import { userRepository } from '../repositories/user.repository';
import { AppError } from '../middleware/errorHandler';

export class UserService {
  async getAllUsers() {
    return userRepository.findAll();
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateUser(id: string, data: Record<string, any>) {
    // Prevent updating password through general update
    if (data.password) {
      delete data.password;
    }

    const user = await userRepository.update(id, data);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async deleteUser(id: string) {
    const user = await userRepository.delete(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}

export const userService = new UserService();
