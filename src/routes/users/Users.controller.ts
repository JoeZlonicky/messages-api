import { hashPassword } from '../../utility/auth/hashPassword';
import { UsersModel } from './Users.model';
import { UsersValidator } from './Users.validator';
import type { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

const getAll = [
  ...UsersValidator.get,
  expressAsyncHandler(async (_req: Request, res: Response) => {
    const result = await UsersModel.getAll();
    res.json(result);
  }),
];

const getById = [
  ...UsersValidator.getById,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = parseInt(req.params.id!);
      const result = await UsersModel.getById(id);

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

    const result = await UsersModel.create(
      username,
      displayName,
      hashedPassword,
    );

    res.json(result);
  }),
];

const update = [
  ...UsersValidator.update,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { displayName } = req.body as {
      displayName: string;
    };

    const result = await UsersModel.update(req.user!.id, displayName);

    res.json(result);
  }),
];

export const UsersController = { getAll, getById, create, update };
