import { app } from '../../app';
import { alice } from '../../config/seedConfig';
import { describe, test } from '@jest/globals';
import request from 'supertest';

test('401 get without authentication', (done) => {
  request(app).get('/sessions').expect(401, done);
});

test('401 remove without authentication', (done) => {
  request(app).delete('/sessions').expect(401, done);
});

test('400 logging in with bad credentials', (done) => {
  request(app)
    .post('/sessions')
    .send(`username=badUsername&password=badPassword`)
    .expect(400, done);
});

describe('log in process', function () {
  const agent = request.agent(app);

  test('log in success', (done) => {
    agent
      .post('/sessions')
      .send(`username=${alice.username}&password=${alice.password}`)
      .expect('Content-Type', /json/)
      .expect({ id: alice.id, displayName: alice.displayName })
      .expect(200, done);
  });

  test('get session', (done) => {
    agent
      .get('/sessions')
      .expect('Content-Type', /json/)
      .expect({ id: alice.id, displayName: alice.displayName })
      .expect(200, done);
  });

  test('log out success', (done) => {
    agent.delete('/sessions').expect(200, done);
  });

  test('no longer authenticated', (done) => {
    agent.get('/sessions').expect(401, done);
  });
});
