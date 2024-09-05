import { prisma } from '../../prisma/prisma';
import { parseQueryToIntegerArray } from '../../utility/parseQueryToIntegerArray';
import { MessageValidator } from './Messages.validator';
import type { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

const TO_SERVER_ID = -1;

const get = expressAsyncHandler(async (req: Request, res: Response) => {
  const fromIds = parseQueryToIntegerArray(
    req.query.fromUserId as string | string[] | undefined,
  );

  const toIds = parseQueryToIntegerArray(
    req.query.toUserId as string | string[] | undefined,
  );

  const authFilter: Prisma.MessageWhereInput = {
    OR: [
      {
        fromUserId: req.user!.id,
      },
      {
        toUserId: req.user!.id,
      },
      {
        toUserId: null,
      },
    ],
  };

  const searchFilter: Prisma.MessageWhereInput = {};

  if (fromIds.length > 0) {
    searchFilter.fromUserId = {
      in: fromIds,
    };
  }

  if (toIds.length > 0) {
    const includeToServer =
      toIds.findIndex((value) => value === TO_SERVER_ID) >= 0;
    if (includeToServer) {
      searchFilter.OR = [
        {
          toUserId: {
            in: toIds,
          },
        },
        {
          toUserId: null,
        },
      ];
    } else {
      searchFilter.toUserId = {
        in: toIds,
      };
    }
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

  res.json(result);
});

const create = [
  ...MessageValidator.create,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { toUserId, content } = req.body as {
      toUserId: string;
      content: string;
    };

    let toUserIdParsed: number | null = parseInt(toUserId);
    if (toUserIdParsed === -1) {
      toUserIdParsed = null;
    }

    const result = await prisma.message.create({
      data: {
        fromUserId: req.user!.id,
        toUserId: toUserIdParsed,
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

    res.json(result);
  }),
];

export const MessagesController = { get, create };
