import { app } from '../../app';
import type { ExposedUser } from '../../types/ExposedUser';
import { useTestSession } from '../../utility/testing/useTestSession';
import { useTestUser } from '../../utility/testing/useTestUser';
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

describe('get requests', () => {
  let agent: TestAgent;
  let exposedUser: ExposedUser;

  beforeAll(async () => {
    [agent, exposedUser] = await useTestSession(0);
  });

  test('get users', (done) => {
    agent.get('/users').expect(200, done);
  });

  test('get user by id', (done) => {
    agent.get(`/users/${exposedUser.id}`).expect(200, done);
  });
});

describe('sign up', () => {
  type signUpData = {
    username: string;
    password: string;
    confirmPassword: string;
    displayName: string;
    secret: string;
  };

  let usernameSuffix = 0;

  function createValidSignUp(): signUpData {
    return {
      username: `username${usernameSuffix++}`, // Handle duplicate usernames
      password: '12345678',
      confirmPassword: '12345678',
      displayName: 'Display Name',
      secret: process.env.SIGN_UP_SECRET,
    };
  }

  function sendSignUp(signUp: signUpData) {
    return request(app)
      .post('/users')
      .send(
        `username=${signUp.username}&password=${signUp.password}&confirmPassword=${signUp.confirmPassword}&displayName=${signUp.displayName}&signUpSecret=${signUp.secret}`,
      );
  }

  let existingUser: User;

  beforeAll(async () => {
    [existingUser] = await useTestUser(0);
  });

  test('success', (done) => {
    const signUp = createValidSignUp();
    sendSignUp(signUp)
      .expect((res) => {
        expect(res.body).toHaveProperty('displayName', signUp.displayName);
      })
      .expect(200, done);
  });

  // --- Username tests ---
  test('missing username fails', (done) => {
    const signUp = createValidSignUp();
    signUp.username = '';
    sendSignUp(signUp).expect(400, done);
  });

  test('non-alphanumeric username fails', (done) => {
    const signUp = createValidSignUp();
    signUp.username = 'with spaces';
    sendSignUp(signUp).expect(400, done);
  });

  test('duplicate username fails', (done) => {
    const signUp = createValidSignUp();
    signUp.username = existingUser.username;
    sendSignUp(signUp).expect(400, done);
  });

  // --- displayName tests ---
  test('missing displayName fails', (done) => {
    const signUp = createValidSignUp();
    signUp.displayName = '';
    sendSignUp(signUp).expect(400, done);
  });

  // --- password tests ---
  test('missing password fails', (done) => {
    const signUp = createValidSignUp();
    signUp.password = '';
    sendSignUp(signUp).expect(400, done);
  });

  test('short password fails', (done) => {
    const signUp = createValidSignUp();
    signUp.password = 'short';
    sendSignUp(signUp).expect(400, done);
  });

  test('missing confirmPassword fails', (done) => {
    const signUp = createValidSignUp();
    signUp.confirmPassword = '';
    sendSignUp(signUp).expect(400, done);
  });

  test('bad confirmPassword fail', (done) => {
    const signUp = createValidSignUp();
    signUp.confirmPassword = 'somethingElse';
    sendSignUp(signUp).expect(400, done);
  });

  // --- signUpSecret tests ---
  test('with signUpSecret success', async () => {
    const before = process.env.SIGN_UP_SECRET;
    const secret = 'secret';
    process.env.SIGN_UP_SECRET = secret;

    const signUp = createValidSignUp();
    signUp.secret = secret;
    await sendSignUp(signUp).expect(200);

    process.env.SIGN_UP_SECRET = before;
  });

  test('with signUpSecret fail', async () => {
    const before = process.env.SIGN_UP_SECRET;
    process.env.SIGN_UP_SECRET = 'secret';

    const signUp = createValidSignUp();
    signUp.secret = 'incorrect';
    await sendSignUp(signUp).expect(400);

    process.env.SIGN_UP_SECRET = before;
  });
});

describe('updating', () => {
  function createValidUpdate() {
    return {
      displayName: 'newDisplayName',
    };
  }

  function sendUpdate(userId: number, update: { displayName: string }) {
    return agent
      .patch(`/users/${userId}`)
      .send(`displayName=${update.displayName}`);
  }

  let agent: TestAgent;
  let user: User;
  let otherUser: User;

  beforeAll(async () => {
    [agent, user] = await useTestSession(0);
    [otherUser] = await useTestUser(1);
  });

  test('missing displayName fails', (done) => {
    const update = createValidUpdate();
    update.displayName = '';
    sendUpdate(user.id, update).expect(400, done);
  });

  test('different id fails', (done) => {
    const update = createValidUpdate();
    sendUpdate(otherUser.id, update).expect(400, done);
  });

  test('success', (done) => {
    const update = createValidUpdate();
    sendUpdate(user.id, update)
      .expect((res) => {
        expect(res.body).toHaveProperty('displayName', update.displayName);
      })
      .expect(200, done);
  });
});
