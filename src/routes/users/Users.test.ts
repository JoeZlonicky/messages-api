import { app } from '../../app';
import { alice } from '../../data/seedData';
import { prisma } from '../../prisma/prisma';
import type { ExposedUser } from '../../types/ExposedUser';
import { useTestSession } from '../../utility/testing/useTestSession';
import { beforeAll, describe, expect, test } from '@jest/globals';
import type { User } from '@prisma/client';
import request from 'supertest';
import type TestAgent from 'supertest/lib/agent';

describe('authentication', () => {
  test('401 get all without authentication', (done) => {
    request(app).get('/users').expect(401, done);
  });

  test('401 get id without authentication', (done) => {
    request(app).get('/users/1').expect(401, done);
  });

  test('401 update without authentication', (done) => {
    request(app).patch('/users/1').expect(401, done);
  });
});

test('sign up success', async () => {
  const newUser: User = {
    id: -1, // Not accurate to actual id in database
    username: 'newUser',
    password: 'password',
    displayName: 'New User',
  };

  await request(app)
    .post('/users')
    .send(
      `username=${newUser.username}&password=${newUser.password}&confirmPassword=${newUser.password}&displayName=${newUser.displayName}`,
    )
    .expect('Content-Type', /json/)
    .expect((res) => {
      expect(res.body).toHaveProperty('displayName', newUser.displayName);
    })
    .expect(200);

  await prisma.user.delete({
    where: {
      username: newUser.username,
    },
  });
});

describe('authenticated requests', () => {
  let agent: TestAgent;
  let exposedUser: ExposedUser;

  beforeAll(async () => {
    [agent, exposedUser] = await useTestSession(alice);
  });

  test('get users', (done) => {
    agent.get('/users').expect(200, done);
  });

  test('get user by id', (done) => {
    agent.get(`/users/${exposedUser.id}`).expect(200, done);
  });
});

describe('invalid sign up fields', () => {});
