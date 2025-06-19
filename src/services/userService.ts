import type { SafeParseReturnType } from 'zod';
import { userRepository } from '../repositories/userRepository';
import { createUserSchema } from '../schemas/userSchemas';
import type { IUser } from '../types';

export const userService = {
  listUsers: (): IUser[] => userRepository.findAll(),
  getUserById: (id: string): IUser | null => {
    const user = userRepository.findById(id);
    return user || null;
  },
  async createUser(data: unknown): Promise<IUser> {
    const result = createUserSchema.safeParse(data);

    if (!result.success) {
      throw result.error;
    }

    return userRepository.create(result.data);
  },
};
