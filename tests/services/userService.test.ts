import { afterEach, describe, expect, test, vi } from 'vitest';
import { userRepository } from '../../src/repositories/userRepository.js';
import { userService } from '../../src/services/userService.js';
import type { IUser } from '../../src/types.js';

vi.mock('../../src/repositories/userRepository.js', () => ({
  userRepository: {
    create: vi.fn(),
    findByEmail: vi.fn(),
  },
}));

describe('User Service - createUser', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockUserData = {
    name: 'Usuário Teste',
    email: 'teste@example.com',
  };

  test('deve criar um usuário e retorná-lo com sucesso', async () => {
    // Arrange
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    const createdUser = { id: 'uuid123', ...mockUserData };
    vi.mocked(userRepository.create).mockResolvedValue(createdUser);

    // Act
    const result = await userService.createUser(mockUserData);

    // Assert
    expect(result).toEqual(createdUser);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUserData.email);
    expect(userRepository.create).toHaveBeenCalledWith(mockUserData);
    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });

  test('deve lançar um erro se o usuário já existir', async () => {
    // Arrange
    const existingUser: IUser = { id: 'uuid-existente', ...mockUserData };
    vi.mocked(userRepository.findByEmail).mockResolvedValue(existingUser);

    // Act & Assert
    await expect(userService.createUser(mockUserData)).rejects.toThrow('User already exists');

    // Assert
    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUserData.email);
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});

// NOTA: Os testes de validação (email inválido, nome ausente) foram removidos.
// Na arquitetura deste projeto, a validação de dados de entrada é responsabilidade
// da camada de rotas (Fastify com Zod), não da camada de serviço. O serviço
// deve receber apenas dados já validados.
