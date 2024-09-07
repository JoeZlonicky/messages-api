import { app } from '../../app';
import { useTestUser } from './useTestUser';
import type { User } from '@prisma/client';
import request from 'supertest';
import type TestAgent from 'supertest/lib/agent';

async function useTestSession(
  userIndex: 0 | 1 | 2,
): Promise<[TestAgent, User]> {
  const agent = request.agent(app);
  const [user, userData] = await useTestUser(userIndex);

  const result = await agent
    .post('/sessions')
    .send(`username=${userData.username}&password=${userData.password}`);

  if (!result) {
    throw new Error('Failed to create test session');
  }

  return [agent, user];
}

export { useTestSession };
