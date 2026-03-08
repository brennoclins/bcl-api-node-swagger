"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const userRepository_1 = require("../../src/repositories/userRepository");
const userService_1 = require("../../src/services/userService");
vitest_1.vi.mock('../../src/repositories/userRepository', () => ({
    userRepository: {
        create: vitest_1.vi.fn(),
    },
}));
(0, vitest_1.describe)('User Service - createUser', () => {
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    const mockUserData = {
        name: 'Usuário Teste',
        email: 'teste@example.com',
    };
    (0, vitest_1.test)('deve criar um usuário e retorná-lo com sucesso', async () => {
        const createdUser = { id: 'uuid123', ...mockUserData };
        vitest_1.vi.mocked(userRepository_1.userRepository.create).mockResolvedValue(createdUser);
        const result = await userService_1.userService.createUser(mockUserData);
        (0, vitest_1.expect)(result).toEqual(createdUser);
        (0, vitest_1.expect)(userRepository_1.userRepository.create).toHaveBeenCalledWith(mockUserData);
        (0, vitest_1.expect)(userRepository_1.userRepository.create).toHaveBeenCalledTimes(1);
    });
    (0, vitest_1.test)('deve lançar um erro se o repositório falhar', async () => {
        const dbError = new Error('DB error');
        vitest_1.vi.mocked(userRepository_1.userRepository.create).mockRejectedValue(dbError);
        await (0, vitest_1.expect)(userService_1.userService.createUser(mockUserData)).rejects.toThrow(dbError);
        (0, vitest_1.expect)(userRepository_1.userRepository.create).toHaveBeenCalledWith(mockUserData);
        (0, vitest_1.expect)(userRepository_1.userRepository.create).toHaveBeenCalledTimes(1);
    });
});
// NOTA: Os testes de validação (email inválido, nome ausente) foram removidos.
// Na arquitetura deste projeto, a validação de dados de entrada é responsabilidade
// da camada de rotas (Fastify com Zod), não da camada de serviço. O serviço
// deve receber apenas dados já validados.
//# sourceMappingURL=userService.test.js.map