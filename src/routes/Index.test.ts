import { app } from '../app';
import { test } from '@jest/globals';
import request from 'supertest';

test('index route', (done) => {
  request(app).get('/').expect({ Hello: 'World' }).expect(200, done);
});

test('page not found', (done) => {
  request(app).get('/invalid-page-route').expect(404, done);
});
