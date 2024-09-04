import { app } from '../../app';
import type { ExposedUser } from '../../types/ExposedUser';
import type { User } from '@prisma/client';
import request from 'supertest';
import type TestAgent from 'supertest/lib/agent';

// Creates a test agent with a session
async function authenticatedAgent(
  user: User,
): Promise<[TestAgent, ExposedUser]> {
  const agent = request.agent(app);
  const result = await agent
    .post('/sessions')
    .send(`username=${user.username}&password=${user.password}`);

  const exposedUser = result.body as ExposedUser;

  return [agent, exposedUser];
}

export { authenticatedAgent };
