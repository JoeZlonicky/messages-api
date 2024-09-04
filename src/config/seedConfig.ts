import type { User } from '@prisma/client';

const alice: User = {
  id: -1, // Will get set automatically by database
  username: 'alice123',
  password: '12345678',
  displayName: 'Alice',
};

const bob: User = {
  id: -1, // Will get set automatically by database
  username: 'bob123',
  password: '12345678',
  displayName: 'Bob',
};

export { alice, bob };
