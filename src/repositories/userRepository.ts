import { prisma } from '@lib/prisma.js';
import type { IUser } from '../types.js';

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
};
