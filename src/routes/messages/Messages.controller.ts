import { prisma } from '../../prisma/prisma';
import { MessageValidator } from './Messages.validator';
import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

const TO_SERVER_ID = -1;

const get = expressAsyncHandler(async (req: Request, res: Response) => {
  const fromUserId = parseInt(req.query.fromUserId as string) || undefined;

  let toUserId: number | null | undefined =
    parseInt(req.query.toUserId as string) || undefined;

  if (toUserId === TO_SERVER_ID) {
    toUserId = null;
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
      fromUserId,
      toUserId,
      OR: [
        {
          OR: [
            {
              fromUserId: req.user!.id,
            },
            {
              toUserId: req.user!.id,
            },
          ],
        },
        {
          toUserId: {
            equals: null,
          },
        },
      ],
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
