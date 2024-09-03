import { SessionsValidator } from './Sessions.validator';
import type { User } from '@prisma/client';
import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

const create = [
  SessionsValidator.create,
  expressAsyncHandler((req: Request, res: Response) => {
    const user = req.user as User;

    req.session.user = user;
    res.json({ id: user.id, displayName: user.displayName });
  }),
];

export const SessionsController = { create };
