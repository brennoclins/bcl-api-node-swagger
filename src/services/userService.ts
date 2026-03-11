import type { z } from 'zod';
import { userRepository } from '../repositories/userRepository.js';
import type { createUserSchema, updateUserSchema } from '../schemas/userSchemas.js';

type CreateUserDTO = z.infer<typeof createUserSchema>;
type UpdateUserDTO = z.infer<typeof updateUserSchema>;

export const userService = {
  async createUser(data: CreateUserDTO) {
    const userAlreadyExists = await userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new Error('User already exists');
    }

    // O ID é gerado automaticamente pelo banco de dados (Prisma + UUID)
    return userRepository.create(data);
  },

  async findById(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  async updateUser(id: string, data: UpdateUserDTO) {
    // Garante que o usuário existe antes de tentar atualizar
    await this.findById(id);

    if (data.email) {
      const userWithSameEmail = await userRepository.findByEmail(data.email);
      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new Error('Email already in use by another user');
      }
    }
    return userRepository.update(id, data);
  },

  async deleteUser(id: string) {
    // Garante que o usuário existe antes de tentar deletar
    await this.findById(id);
    await userRepository.delete(id);
  },
};
