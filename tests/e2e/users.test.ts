import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { userRepository } from '../../src/repositories/userRepository';
import { build } from '../../src/server';
import type { IUser } from '../../src/types';

describe('POST /users', () => {
  const testApp = build();
  const mockUser = {
    name: 'Teste E2E',
    email: 'e2e@teste.com',
  };

  let token: string;

  beforeAll(async () => {
    await testApp.ready();
    vi.spyOn(userRepository, 'create').mockImplementation((data: Omit<IUser, 'id'>) => ({
      id: randomUUID(),
      ...data,
    }));

    // Gera um token válido pare os testes
    token = testApp.jwt.sign({ sub: 'user123', name: 'Tester' }, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await testApp.close();
    vi.restoreAllMocks();
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
