import { app } from '../../app';
import type { User } from '@prisma/client';
import request from 'supertest';

function authenticatedAgent(user: User, cb: () => void) {
  const agent = request.agent(app);
  agent
    .post('/sessions')
    .send(`username=${user.username}&password=${user.password}`)
    .end(cb);

  return agent;
}

export { authenticatedAgent };
