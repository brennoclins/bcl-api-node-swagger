import { randomUUID } from 'node:crypto';
import { describe, expect, test, vi } from 'vitest';
import { userRepository } from '../../src/repositories/userRepository';
import { userService } from '../../src/services/userService';

vi.mock('../../src/repositories/userRepository', () => ({
  userRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  },
}));

describe('User Service - createUser', () => {
  test('deve criar usuário com dados válidos', () => {
    const mockUser = {
      name: 'Novo Usuário',
      email: 'valido@teste.com',
    };

    const expectedUser = {
      id: randomUUID(),
      ...mockUser,
    };

    vi.mocked(userRepository.create).mockReturnValueOnce(expectedUser);

    const result = userService.createUser(mockUser);

    expect(result.success).toBe(true);
    expect(result.user).toEqual(expectedUser);
    expect(userRepository.create).toHaveBeenCalledWith(mockUser);
  });

  test('deve retornar erro de validação para email inválido', () => {
    const invalidUser = {
      name: 'Usuário Inválido',
      email: 'email-mal-formatado',
    };

    const result = userService.createUser(invalidUser);

    expect(result.success).toBe(false);
    expect(result.error?.fieldErrors).toHaveProperty('email');
  });

  test('deve retornar erro para nome faltante', () => {
    const invalidUser = {
      email: 'sem@nome.com',
    };

    const result = userService.createUser(invalidUser);

    expect(result.success).toBe(false);
    expect(result.error?.fieldErrors).toHaveProperty('name');
  });

  test('deve tratar erros inesperados do repositório', () => {
    const validUser = {
      name: 'Erro Teste',
      email: 'erro@teste.com',
    };

    vi.mocked(userRepository.create).mockImplementationOnce(() => {
      throw new Error('Erro de banco de dados');
    });

    const result = userService.createUser(validUser);

    expect(result.success).toBe(false);
    expect(result.error?.message).toEqual('Failed to create user');
  });
});
