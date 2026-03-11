import { prisma } from '@lib/prisma.js';
import type { IUser } from '../types.js';

// O tipo do DTO de atualização, que é um subconjunto parcial do IUser
type UpdateUserData = Partial<Omit<IUser, 'id'>>;

export const userRepository = {
  async create(data: Omit<IUser, 'id'>): Promise<IUser> {
    return prisma.user.create({
      data,
    });
  },

  async findByEmail(email: string): Promise<IUser | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  async findAll(): Promise<IUser[]> {
    return prisma.user.findMany();
  },

  async findById(id: string): Promise<IUser | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  async update(id: string, data: UpdateUserData): Promise<IUser> {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  /**
   * Deleta um usuário pelo seu ID.
   */
  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  },
};
