import { app } from '../../app';
import { prisma } from '../../prisma/prisma';
import { useTestMessage } from '../../utility/testing/useTestMessage';
import { useTestSession } from '../../utility/testing/useTestSession';
import { useTestUser } from '../../utility/testing/useTestUser';
import { beforeAll, describe, expect, test } from '@jest/globals';
import type { Message, User } from '@prisma/client';
import request from 'supertest';
import type TestAgent from 'supertest/lib/agent';

test('401 get without authentication', (done) => {
  request(app).get('/messages').expect(401, done);
});

test('401 post without authentication', (done) => {
  request(app).post('/messages').expect(401, done);
});

describe('get messages', () => {
  let agent: TestAgent;

  let alice: User;
  let bob: User;
  let caitlin: User;

  let serverMessages: Message[];
  let visiblePrivateMessages: Message[];

  beforeAll(async () => {
    await prisma.message.deleteMany();

    [agent, alice] = await useTestSession(0);
    [bob] = await useTestUser(1);
    [caitlin] = await useTestUser(2);

    serverMessages = [
      await useTestMessage(bob.id, null, 'Hi, server!'),
      await useTestMessage(alice.id, null, 'I also want to say hi, server!'),
    ];

    visiblePrivateMessages = [
      await useTestMessage(alice.id, caitlin.id, 'Hi, Caitlin!'),
      await useTestMessage(caitlin.id, alice.id, 'Hi, Alice!'),
    ];

    // Hidden messages
    await useTestMessage(caitlin.id, bob.id, 'Hi, Bob!');
  });

  test('get visible messages', (done) => {
    agent
      .get('/messages')
      .expect((res) => {
        expect(res.body).toHaveLength(
          serverMessages.length + visiblePrivateMessages.length,
        );
      })
      .expect(200, done);
  });

  test('get server messages', (done) => {
    agent
      .get('/messages?toUserId=-1')
      .expect((res) => {
        expect(res.body).toHaveLength(serverMessages.length);
      })
      .expect(200, done);
  });

  test('get messages from user', (done) => {
    agent
      .get(`/messages?fromUserId=${alice.id}`)
      .expect((res) => {
        expect(res.body).toHaveLength(2);
      })
      .expect(200, done);
  });

  test('get messages from user', (done) => {
    agent
      .get(`/messages?fromUserId=${alice.id}`)
      .expect((res) => {
        expect(res.body).toHaveLength(2);
      })
      .expect(200, done);
  });

  test('get messages to user', (done) => {
    agent
      .get(`/messages?toUserId=${alice.id}`)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
      })
      .expect(200, done);
  });

  test('get messages from user to user', (done) => {
    const message = visiblePrivateMessages[0];
    agent
      .get(
        `/messages?fromUserId=${message?.fromUserId}&toUserId=${message?.toUserId}`,
      )
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect((res.body as [{ content: string }])[0]).toHaveProperty(
          'content',
          message?.content,
        );
      })
      .expect(200, done);
  });

  test('get messages between users', (done) => {
    agent
      .get(
        `/messages?fromUserId=${caitlin.id}&fromUserId=${alice.id}&toUserId=${alice.id}&toUserId=${caitlin.id}`,
      )
      .expect((res) => {
        expect(res.body).toHaveLength(visiblePrivateMessages.length);
      })
      .expect(200, done);
  });
});

describe('create message', () => {
  let agent: TestAgent;
  let sender: User;
  let receiver: User;

  function createValidMessage() {
    return {
      toUserId: receiver.id,
      content: 'Hi!',
    };
  }

  function sendMessage(message: { toUserId: number; content: string }) {
    return agent
      .post('/messages')
      .send(`toUserId=${message.toUserId}&content=${message.content}`);
  }

  beforeAll(async () => {
    [agent, sender] = await useTestSession(0);
    [receiver] = await useTestUser(1);
  });

  test('empty post fails', (done) => {
    agent.post(`/messages`).expect(400, done);
  });

  test('success', (done) => {
    const message = createValidMessage();
    sendMessage(message)
      .expect((res) => {
        expect(res.body).toHaveProperty('fromUserId', sender.id);
        expect(res.body).toHaveProperty('toUserId', receiver.id);
        expect(res.body).toHaveProperty('content', message.content);
      })
      .expect(200, done);
  });

  test('missing content fails', (done) => {
    const message = createValidMessage();
    message.content = '';
    sendMessage(message).expect(400, done);
  });

  test('invalid toUserId fails', (done) => {
    const message = createValidMessage();
    message.toUserId = 999;
    sendMessage(message).expect(400, done);
  });

  test('invalid toUserId fails', (done) => {
    const message = createValidMessage();
    message.toUserId = 999;
    sendMessage(message).expect(400, done);
  });
});
