import { app } from '../../app';
import type { SessionData } from '../../types/SessionData';
import type { User } from '@prisma/client';
import request from 'supertest';
import type TestAgent from 'supertest/lib/agent';

// Creates a test agent with a session
async function authenticatedAgent(
  user: User,
): Promise<[TestAgent, SessionData]> {
  const agent = request.agent(app);
  const result = await agent
    .post('/sessions')
    .send(`username=${user.username}&password=${user.password}`);

  const sessionData = result.body as SessionData;

  return [agent, sessionData];
}

export { authenticatedAgent };
