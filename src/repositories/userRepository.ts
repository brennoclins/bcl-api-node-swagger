import { randomUUID } from 'node:crypto';
import type { IUser } from '../types';

const users: IUser[] = [
  {
    id: randomUUID(),
    name: 'Brenno',
    email: 'b@bcl.com',
  },
];

export const userRepository = {
  findAll: (): IUser[] => users,
  findById: (id: string): IUser | null => {
    const user = users.find((u) => u.id === id);
    return user || null;
  },
  findByEmail: (email: string): IUser | null => {
    const user = users.find((u) => u.email === email);
    return user || null;
  },
  create: (userData: Omit<IUser, 'id'>): IUser => {
    const newUser = { id: randomUUID(), ...userData };
    users.push(newUser);
    return newUser;
  },
};
