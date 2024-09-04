import { PrismaClient } from '@prisma/client';

const prisma =
  process.env.TEST_ENV === 'true'
    ? new PrismaClient({
        datasources: {
          db: {
            url: process.env.TEST_DATABASE_URI,
          },
        },
      })
    : new PrismaClient();

export { prisma };
