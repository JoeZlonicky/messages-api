import { prisma } from '../../prisma/prisma';
import type { Message } from '@prisma/client';

type MessageData = {
  content: string;
  fromUserId: number;
  toUserId: number | null;
};

async function useTestMessages(messageData: MessageData[]): Promise<Message[]> {
  const messages = Promise.all(
    messageData.map(async (data) => {
      const existing = await prisma.message.findFirst({
        where: {
          content: data.content,
          fromUserId: data.fromUserId,
          toUserId: data.toUserId,
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
