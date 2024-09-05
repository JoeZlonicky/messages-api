import { app } from '../../app';
import { alice, bob, caitlin, messageContents } from '../../data/seedData';
import { useTestMessages } from '../../utility/testing/useTestMessages';
import { useTestSession } from '../../utility/testing/useTestSession';
import { useTestUsers } from '../../utility/testing/useTestUsers';
import { beforeAll, describe, expect, test } from '@jest/globals';
import type { Message, User } from '@prisma/client';
import request from 'supertest';
import type TestAgent from 'supertest/lib/agent';

test('401 without authentication', (done) => {
  request(app).get('/messages').expect(401, done);
});

describe('authenticated requests', function () {
  let agent: TestAgent;
  let aliceUser: User;
  let bobUser: User;
  let caitlinUser: User;
  let serverMessages: Message[];
  let visiblePrivateMessages: Message[];

  beforeAll(async () => {
    [agent, aliceUser] = await useTestSession(alice);
    [bobUser, caitlinUser] = (await useTestUsers([bob, caitlin])) as [
      User,
      User,
    ];
    serverMessages = await useTestMessages([
      {
        content: messageContents.aliceToServer,
        fromUserId: aliceUser.id,
        toUserId: null,
      },
      {
        content: messageContents.bobToServer,
        fromUserId: bobUser.id,
        toUserId: null,
      },
    ]);
    visiblePrivateMessages = await useTestMessages([
      {
        content: messageContents.aliceToCaitlin,
        fromUserId: aliceUser.id,
        toUserId: caitlinUser.id,
      },
      {
        content: messageContents.caitlinToAlice,
        fromUserId: caitlinUser.id,
        toUserId: aliceUser.id,
      },
    ]);

    // Hidden messages
    await useTestMessages([
      {
        content: messageContents.caitlinToBob,
        fromUserId: caitlinUser.id,
        toUserId: bobUser.id,
      },
    ]);
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
      .get(`/messages?fromUserId=${aliceUser.id}`)
      .expect((res) => {
        expect(res.body).toHaveLength(2);
      })
      .expect(200, done);
  });

  test('get messages from user', (done) => {
    agent
      .get(`/messages?fromUserId=${aliceUser.id}`)
      .expect((res) => {
        expect(res.body).toHaveLength(2);
      })
      .expect(200, done);
  });

  test('get messages to user', (done) => {
    agent
      .get(`/messages?toUserId=${aliceUser.id}`)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
      })
      .expect(200, done);
  });

  test('get messages from user to user', (done) => {
    agent
      .get(`/messages?fromUserId=${caitlinUser.id}&toUserId=${aliceUser.id}`)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect((res.body as [{ content: string }])[0]).toHaveProperty(
          'content',
          messageContents.caitlinToAlice,
        );
      })
      .expect(200, done);
  });

  test('get messages between users', (done) => {
    agent
      .get(
        `/messages?fromUserId=${caitlinUser.id}&fromUserId=${aliceUser.id}&toUserId=${aliceUser.id}&toUserId=${caitlinUser.id}`,
      )
      .expect((res) => {
        expect(res.body).toHaveLength(2);
      })
      .expect(200, done);
  });
});
