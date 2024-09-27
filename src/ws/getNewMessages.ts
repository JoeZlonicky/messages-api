import { prisma } from '../prisma/prisma';

async function getNewMessages(lastId: number) {
  const newMessages = await prisma.message.findMany({
    include: {
      fromUser: {
        select: {
          id: true,
          displayName: true,
        },
      },
      toUser: {
        select: {
          id: true,
          displayName: true,
        },
      },
    },
    where: {
      id: {
        gt: lastId,
      },
    },
    orderBy: {
      id: 'asc',
    },
  });
  return newMessages;
}

export { getNewMessages };
