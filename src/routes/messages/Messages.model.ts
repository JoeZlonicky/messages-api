import { prisma } from '../../prisma/prisma';
import type { Prisma } from '@prisma/client';

const TO_SERVER_ID = -1;

async function getAll(userId: number, fromIds: number[], toIds: number[]) {
  const authFilter: Prisma.MessageWhereInput = {
    OR: [
      {
        fromUserId: userId,
      },
      {
        toUserId: userId,
      },
      {
        toUserId: null,
      },
    ],
  };

  const searchFilter: Prisma.MessageWhereInput = {};
  searchFilter.fromUserId = {
    in: fromIds.length > 0 ? fromIds : undefined,
  };

  if (toIds.length > 0) {
    const hasExplicitToServer = toIds.includes(TO_SERVER_ID);
    searchFilter.OR = [
      {
        toUserId: {
          in: toIds.length > 0 ? toIds : undefined,
        },
      },
      {
        toUserId: {
          equals: hasExplicitToServer ? null : undefined,
        },
      },
    ];
  }

  const result = await prisma.message.findMany({
    include: {
      fromUser: {
        select: {
          id: true,
          username: true,
        },
      },
      toUser: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    where: {
      AND: [authFilter, searchFilter],
    },
  });

  return result;
}

async function create(
  userId: number,
  toUserId: number | null,
  content: string,
) {
  const result = await prisma.message.create({
    data: {
      fromUserId: userId,
      toUserId: toUserId,
      content,
    },
    include: {
      fromUser: {
        select: {
          id: true,
          username: true,
        },
      },
      toUser: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return result;
}

export const MessagesModel = { getAll, create };
