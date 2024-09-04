import RedisStore from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';

const redisStore = () => {
  // This results in memory store being used for sessions
  // Otherwise Redis will cause jest to hang
  // Might be worth looking into a better solution in the future
  if (process.env.NODE_ENV === 'test') {
    return undefined;
  }

  const redisClient = createClient();
  redisClient.connect().catch(console.error);

  new RedisStore({
    client: redisClient,
    prefix: process.env.REDIS_PREFIX
      ? process.env.REDIS_PREFIX + ':'
      : undefined,
  });
};

const authSession = session({
  store: redisStore(),
  resave: false,
  saveUninitialized: false,
  secret: process.env.AUTH_SECRET,
  cookie: {
    maxAge: /* 30 days = */ 30 * 24 * 60 * 60 * 1000,
    secure: process.env.AUTH_SECURE === 'true' || undefined,
    httpOnly: process.env.AUTH_SECURE === 'true' || undefined,
  },
});

export { authSession };
