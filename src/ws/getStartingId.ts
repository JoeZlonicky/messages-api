import { prisma } from '../prisma/prisma';

async function getStartingId() {
  const latestMessage = await prisma.message.findFirst({
    orderBy: { id: 'desc' },
  });

  return latestMessage ? latestMessage.id : 0;
}

export { getStartingId };
