import { prisma } from '../prisma/prisma';
import { notify } from './notify';
import { Server } from 'socket.io';

const POLLING_TIME_MS = 1000.0;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startPolling(io: Server) {
  let lastId = 0;
  const latestMessage = await prisma.message.findFirst({
    orderBy: { id: 'desc' },
  });
  if (latestMessage) {
    lastId = latestMessage.id;
  }

  while (true) {
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

    if (newMessages.length > 0) {
      lastId = newMessages.at(-1)?.id as number;
    }

    newMessages.forEach((message) => {
      notify(io, message);
    });

    await delay(POLLING_TIME_MS);
  }
}

export { startPolling };
