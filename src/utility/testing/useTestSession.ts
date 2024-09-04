import { app } from '../../app';
import { useTestUsers } from './useTestUsers';
import type { Prisma, User } from '@prisma/client';
import request from 'supertest';
import type TestAgent from 'supertest/lib/agent';

async function useTestSession(
  userData: Prisma.UserCreateInput,
): Promise<[TestAgent, User]> {
  const agent = request.agent(app);
  const users = await useTestUsers([userData]);
  const user = users[0];

  if (!user) {
    throw new Error();
  }

  const result = await agent
    .post('/sessions')
    .send(`username=${user.username}&password=${userData.password}`);

  if (!result) {
    throw new Error();
  }

  return [agent, user];
}

export { useTestSession };
