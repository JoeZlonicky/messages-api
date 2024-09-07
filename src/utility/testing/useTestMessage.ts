import { prisma } from '../../prisma/prisma';

async function useTestMessage(
  fromUserId: number,
  toUserId: number | null,
  content: string,
) {
  const existing = await prisma.message.findFirst({
    where: {
      fromUserId,
      toUserId,
      content,
    },
  });

  if (existing) {
    return existing;
  }

  return await prisma.message.create({
    data: {
      fromUserId,
      toUserId,
      content,
    },
  });
}

export { useTestMessage };
