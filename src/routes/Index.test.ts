import { app } from '../app';
import { test } from '@jest/globals';
import request from 'supertest';

test('index route', (done) => {
  request(app)
    .get('/')
    .expect('Content-Type', /json/)
    .expect({ Hello: 'World' })
    .expect(200, done);
});
