import { describe, expect, test, vi, afterEach } from 'vitest';
import { userRepository } from '../../src/repositories/userRepository';
import { userService } from '../../src/services/userService';
import type { IUser } from '../../src/types';

vi.mock('../../src/repositories/userRepository', () => ({
  userRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  },
}));

describe('User Service — createUser', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const createMockUser = (overrides?: Partial<IUser>) => ({
    name: 'Usuário Teste',
    email: 'teste@example.com',
    password: 'senha123',
    ...overrides,
  });

  test('deve criar usuário com dados válidos', () => {
    const mockUser = createMockUser();
    const createdUser = { id: 'uuid123', ...mockUser };

    vi.mocked(userRepository.create).mockReturnValueOnce(createdUser);

    const result = userService.createUser(mockUser);

    expect(result.success).toBe(true);
    expect(result.user).toMatchObject({
      name: mockUser.name,
      email: mockUser.email,
    });
    expect(result.user?.id).toEqual(expect.any(String));
    expect(userRepository.create).toHaveBeenCalledWith(mockUser);
  });

  test('deve retornar erro de validação com email inválido', () => {
    const invalidData = createMockUser({ email: 'invalid-email' });
    const result = userService.createUser(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.fieldErrors).toHaveProperty('email');
  });

  test('deve retornar erro se nome estiver ausente', () => {
    const invalidData = createMockUser({ name: '' });
    const result = userService.createUser(invalidData);

    expect(result.success).toBe(false);
    expect(result.error?.fieldErrors).toHaveProperty('name');
  });

  test('deve lidar com erro do repositório', () => {
    const validData = createMockUser();

    vi.mocked(userRepository.create).mockImplementationOnce(() => {
      throw new Error('DB error');
    });

    const result = userService.createUser(validData);

    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('Failed to create user');
  });
});
