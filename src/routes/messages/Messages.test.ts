import { app } from '../../app';
import { alice, messageContents } from '../../data/seedData';
import { useTestMessages } from '../../utility/testing/useTestMessages';
import { useTestSession } from '../../utility/testing/useTestSession';
import { beforeAll, describe, expect, test } from '@jest/globals';
import type { Message, User } from '@prisma/client';
import request from 'supertest';
import type TestAgent from 'supertest/lib/agent';

test('401 without authentication', (done) => {
  request(app).get('/messages').expect(401, done);
});

describe('authenticated requests', function () {
  let agent: TestAgent;
  let user: User;
  let messages: Message[];

  beforeAll(async () => {
    [agent, user] = await useTestSession(alice);
    messages = await useTestMessages([
      {
        content: messageContents.aliceToCaitlin,
        fromUser: {
          connect: {
            id: user.id,
          },
        },
      },
    ]);
  });

  test('gets messages', (done) => {
    agent
      .get('/messages')
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveLength(messages.length);
      })
      .expect(200, done);
  });

  test('404 on unknown message', (done) => {
    agent.get('/messages/999').expect(404, done);
  });
});
