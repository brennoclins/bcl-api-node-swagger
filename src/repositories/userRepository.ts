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
  findById: (id: string): IUser | undefined => users.find((u) => u.id === id),
};
