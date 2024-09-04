import { app } from '../../app';
import { alice, messages } from '../../config/seedConfig';
import { authenticatedAgent } from '../../utility/testing/authenticatedAgent';
import { beforeAll, describe, expect, test } from '@jest/globals';
import request from 'supertest';
import type TestAgent from 'supertest/lib/agent';

test('401 without authentication', (done) => {
  request(app).get('/messages').expect(401, done);
});

describe('authenticated requests', function () {
  let agent: TestAgent;

  beforeAll(async () => {
    [agent] = await authenticatedAgent(alice);
  });

  test('gets messages', (done) => {
    agent
      .get('/messages')
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveLength(
          [
            messages.aliceToCaitlin,
            messages.aliceToServer,
            messages.bobToServer,
            messages.caitlinToAlice,
          ].length,
        );
      })
      .expect(200, done);
  });

  test('404 on unknown message', (done) => {
    agent.get('/messages/999').expect(404, done);
  });
});
