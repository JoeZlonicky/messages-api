import RedisStore from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';

const redisClient = createClient();
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'messages:',
});

const authSession = () =>
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.AUTH_SECRET,
    cookie: {
      maxAge: /* 30 days = */ 30 * 24 * 60 * 60 * 1000,
    },
  });

export { authSession };
