import { app } from '../../app';
import { alice } from '../../data/seedData';
import { useTestSession } from '../../utility/testing/useTestSession';
import { beforeAll, describe, expect, test } from '@jest/globals';
import type { User } from '@prisma/client';
import request from 'supertest';
import type TestAgent from 'supertest/lib/agent';

describe('authentication', function () {
  test('401 get without authentication', (done) => {
    request(app).get('/sessions').expect(401, done);
  });

  test('401 remove without authentication', (done) => {
    request(app).delete('/sessions').expect(401, done);
  });
});

describe('validation', function () {
  test('400 logging in with bad credentials', (done) => {
    request(app)
      .post('/sessions')
      .send(`username=badUsername&password=badPassword`)
      .expect(400, done);
  });
});

describe('log in process', () => {
  let agent: TestAgent;
  let user: User;

  beforeAll(async () => {
    [agent, user] = await useTestSession(alice);
  });

  test('log in success', (done) => {
    expect(user).toHaveProperty('displayName', alice.displayName);
    done();
  });

  test('get session', (done) => {
    agent
      .get('/sessions')
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('displayName', alice.displayName);
      })
      .expect(200, done);
  });

  test('log out success', (done) => {
    agent.delete('/sessions').expect(200, done);
  });

  test('no longer authenticated', (done) => {
    agent.get('/sessions').expect(401, done);
  });
});
