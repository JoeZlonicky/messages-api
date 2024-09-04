import { prisma } from '../../prisma/prisma';
import type { Message, Prisma } from '@prisma/client';

async function useTestMessages(
  messageData: Prisma.MessageCreateInput[],
): Promise<Message[]> {
  const messages = Promise.all(
    messageData.map(async (data) => {
      const existing = await prisma.message.findFirst({
        where: {
          content: data.content,
        },
      });
      if (existing) {
        return existing;
      }
      return await prisma.message.create({
        data,
      });
    }),
  );

  return messages;
}

export { useTestMessages };
