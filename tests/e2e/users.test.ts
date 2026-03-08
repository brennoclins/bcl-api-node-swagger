import { prisma } from '@lib/prisma.js';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { build } from '../../src/server.js';

describe('POST /users', () => {
  const testApp = build();
  const mockUser = {
    name: 'Teste E2E',
    email: 'e2e@teste.com',
  };

  let token: string;

  beforeAll(async () => {
    await testApp.ready();
    // Gera um token válido para os testes
    token = testApp.jwt.sign({ sub: 'user123', name: 'Tester' }, { expiresIn: '1h' });
  });

  afterEach(async () => {
    await prisma.user.deleteMany(); // Limpa a tabela de usuários após cada teste
  });

  afterAll(async () => {
    await testApp.close();
  });

  test('Deve retornar 201 com dados válidos', async () => {
    const response = await testApp.inject({
      method: 'POST',
      url: '/users',
      headers: { authorization: `Bearer ${token}` },
      payload: mockUser,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      id: expect.any(String),
      ...mockUser,
    });
  });

  test('Deve retornar 409 se o usuário já existir', async () => {
    // Cria o usuário uma vez
    await testApp.inject({
      method: 'POST',
      url: '/users',
      headers: { authorization: `Bearer ${token}` },
      payload: mockUser,
    });

    // Tenta criar o mesmo usuário novamente
    const response = await testApp.inject({
      method: 'POST',
      url: '/users',
      headers: { authorization: `Bearer ${token}` },
      payload: mockUser,
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toHaveProperty('error', 'User already exists');
  });

  test('Deve retornar 400 sem nome', async () => {
    const response = await testApp.inject({
      method: 'POST',
      url: '/users',
      headers: { authorization: `Bearer ${token}` },
      payload: { email: 'sem@nome.com' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('error.fieldErrors.name');
  });

  test('Deve retornar 400 com email inválido', async () => {
    const response = await testApp.inject({
      method: 'POST',
      url: '/users',
      headers: { authorization: `Bearer ${token}` },
      payload: { ...mockUser, email: 'email-invalido' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('error.fieldErrors.email');
  });

  test('Deve rejeitar campos não permitidos', async () => {
    const response = await testApp.inject({
      method: 'POST',
      url: '/users',
      headers: { authorization: `Bearer ${token}` },
      payload: { ...mockUser, idade: 30 },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('error.fieldErrors.idade');
  });
});
