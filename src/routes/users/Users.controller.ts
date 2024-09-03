import { prisma } from '../../prisma/prisma';
import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

const get = expressAsyncHandler(async (_req: Request, res: Response) => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      displayName: true,
    },
  });
  res.json(result);
});

export const UsersController = { get };
