"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const userRepository_1 = require("../../src/repositories/userRepository");
const server_1 = require("../../src/server");
(0, vitest_1.describe)('POST /users', () => {
    const testApp = (0, server_1.build)();
    const mockUser = {
        name: 'Teste E2E',
        email: 'e2e@teste.com',
    };
    let token;
    (0, vitest_1.beforeAll)(async () => {
        await testApp.ready();
        vitest_1.vi.spyOn(userRepository_1.userRepository, 'create').mockImplementation(async (data) => {
            return data;
        });
        // Gera um token válido pare os testes
        token = testApp.jwt.sign({ sub: 'user123', name: 'Tester' }, { expiresIn: '1h' });
    });
    (0, vitest_1.afterAll)(async () => {
        await testApp.close();
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.test)('Deve retornar 201 com dados válidos', async () => {
        const response = await testApp.inject({
            method: 'POST',
            url: '/users',
            headers: { authorization: `Bearer ${token}` },
            payload: mockUser,
        });
        (0, vitest_1.expect)(response.statusCode).toBe(201);
        (0, vitest_1.expect)(response.json()).toMatchObject({
            id: vitest_1.expect.any(String),
            ...mockUser,
        });
    });
    (0, vitest_1.test)('Deve retornar 400 sem nome', async () => {
        const response = await testApp.inject({
            method: 'POST',
            url: '/users',
            headers: { authorization: `Bearer ${token}` },
            payload: { email: 'sem@nome.com' },
        });
        (0, vitest_1.expect)(response.statusCode).toBe(400);
        (0, vitest_1.expect)(response.json()).toHaveProperty('error.fieldErrors.name');
    });
    (0, vitest_1.test)('Deve retornar 400 com email inválido', async () => {
        const response = await testApp.inject({
            method: 'POST',
            url: '/users',
            headers: { authorization: `Bearer ${token}` },
            payload: { ...mockUser, email: 'email-invalido' },
        });
        (0, vitest_1.expect)(response.statusCode).toBe(400);
        (0, vitest_1.expect)(response.json()).toHaveProperty('error.fieldErrors.email');
    });
    (0, vitest_1.test)('Deve rejeitar campos não permitidos', async () => {
        const response = await testApp.inject({
            method: 'POST',
            url: '/users',
            headers: { authorization: `Bearer ${token}` },
            payload: { ...mockUser, idade: 30 },
        });
        (0, vitest_1.expect)(response.statusCode).toBe(400);
        (0, vitest_1.expect)(response.json()).toHaveProperty('error.fieldErrors.idade');
    });
});
//# sourceMappingURL=users.test.js.map