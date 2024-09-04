import { hashPassword } from '../../auth/hashPassword';
import { prisma } from '../../prisma/prisma';
import { UsersValidator } from './Users.validator';
import type { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

const getAll = [
  ...UsersValidator.get,
  expressAsyncHandler(async (_req: Request, res: Response) => {
    const result = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
      },
    });
    res.json(result);
  }),
];

const getById = [
  ...UsersValidator.getById,
  expressAsyncHandler(
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
  ),
];

const create = [
  ...UsersValidator.create,
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
  ...UsersValidator.update,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { displayName } = req.body as {
      displayName?: string;
    };

    if (!displayName) return;

    const result = await prisma.user.update({
      select: {
        id: true,
        displayName: true,
      },
      data: {
        displayName,
      },
      where: {
        id: req.user!.id,
      },
    });

    res.json(result);
  }),
];

export const UsersController = { getAll, getById, create, update };
