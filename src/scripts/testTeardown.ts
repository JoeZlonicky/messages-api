import { prisma } from '../prisma/prisma';

async function testTeardown() {
  await prisma.message.deleteMany();
  await prisma.user.deleteMany();
}

export default testTeardown;
