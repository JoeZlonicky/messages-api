import { prisma } from '../../prisma/prisma';
import type { Prisma } from '@prisma/client';

const TO_SERVER_ID = -1;

async function getAll(
  userId: number,
  fromUserIds: number[],
  toUserIds: number[],
  afterId: number | undefined = undefined,
) {
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
    in: fromUserIds.length > 0 ? fromUserIds : undefined,
  };

  if (toUserIds.length > 0) {
    const hasExplicitToServer = toUserIds.includes(TO_SERVER_ID);
    searchFilter.OR = [
      {
        toUserId: {
          in: toUserIds.length > 0 ? toUserIds : undefined,
        },
      },
      {
        toUserId: {
          equals: hasExplicitToServer ? null : undefined,
        },
      },
    ];
  }

  const minIdFilter: Prisma.MessageWhereInput = {
    id: {
      gt: afterId,
    },
  };

  const result = await prisma.message.findMany({
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
      AND: [authFilter, searchFilter, minIdFilter],
    },
    orderBy: {
      id: 'asc',
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
  });

  return result;
}

export const MessagesModel = { getAll, create };
