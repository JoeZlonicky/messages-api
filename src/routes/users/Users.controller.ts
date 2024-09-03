import { prisma } from '../../prisma/prisma';
import { hashPassword } from '../../utility/hashPassword';
import { UsersValidator } from './Users.validator';
import type { NextFunction, Request, Response } from 'express';
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

const getById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id!);
    const result = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
      },
      where: { id },
    });
    if (!result) {
      return next();
    }
    res.json(result);
  },
);

const create = [
  UsersValidator.create,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { username, displayName, password } = req.body as {
      username: string;
      displayName: string;
      password: string;
    };

    const hashedPassword = await hashPassword(password);

    const result = await prisma.user.create({
      data: {
        username,
        displayName,
        password: hashedPassword,
      },
      select: {
        id: true,
        displayName: true,
      },
    });

    res.json(result);
  }),
];

const update = [
  UsersValidator.update,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { displayName } = req.body as {
      displayName?: string;
    };

    if (!displayName) return;

    // TODO: Implement once auth is done
    await prisma.user.update({
      data: {
        displayName,
      },
      where: {
        username: 'test',
      },
    });

    //res.json(result);
    res.type('text');
    res.status(501).send('Not implemented');
  }),
];

export const UsersController = { get, getById, create, update };
