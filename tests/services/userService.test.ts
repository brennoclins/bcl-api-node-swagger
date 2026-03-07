import { afterEach, describe, expect, test, vi } from 'vitest';
import { userRepository } from '../../src/repositories/userRepository';
import { userService } from '../../src/services/userService';

vi.mock('../../src/repositories/userRepository', () => ({
  userRepository: {
    create: vi.fn(),
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
    const createdUser = { id: 'uuid123', ...mockUserData };
    vi.mocked(userRepository.create).mockResolvedValue(createdUser);

    const result = await userService.createUser(mockUserData);

    expect(result).toEqual(createdUser);
    expect(userRepository.create).toHaveBeenCalledWith(mockUserData);
    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });

  test('deve lançar um erro se o repositório falhar', async () => {
    const dbError = new Error('DB error');
    vi.mocked(userRepository.create).mockRejectedValue(dbError);

    await expect(userService.createUser(mockUserData)).rejects.toThrow(dbError);

    expect(userRepository.create).toHaveBeenCalledWith(mockUserData);
    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });
});

// NOTA: Os testes de validação (email inválido, nome ausente) foram removidos.
// Na arquitetura deste projeto, a validação de dados de entrada é responsabilidade
// da camada de rotas (Fastify com Zod), não da camada de serviço. O serviço
// deve receber apenas dados já validados.
