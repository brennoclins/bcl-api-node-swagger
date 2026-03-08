import type { z } from 'zod';
import { userRepository } from '../repositories/userRepository.js';
import { createUserSchema } from '../schemas/userSchemas.js';

type CreateUserDTO = z.infer<typeof createUserSchema>;

export const userService = {
  async createUser(data: CreateUserDTO) {
    const userAlreadyExists = await userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new Error('User already exists');
    }

    // O ID é gerado automaticamente pelo banco de dados (Prisma + UUID)
    return userRepository.create(data);
  },
};
