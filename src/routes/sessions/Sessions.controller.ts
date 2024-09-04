import { SessionsValidator } from './Sessions.validator';
import type { User } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

const get = [
  ...SessionsValidator.get,
  expressAsyncHandler((req: Request, res: Response) => {
    res.json({ id: req.user!.id, displayName: req.user!.displayName });
  }),
];

const create = [
  ...SessionsValidator.create,
  expressAsyncHandler((req: Request, res: Response, next: NextFunction) => {
    req.session.regenerate((err) => {
      if (err) {
        return next(err);
      }

      const user = req.user as User;
      req.session.userId = user.id;

      req.session.save((err) => {
        if (err) {
          return next(err);
        }
        res.json({ id: user.id, displayName: user.displayName });
      });
    });
  }),
];

const remove = [
  ...SessionsValidator.remove,
  expressAsyncHandler((req: Request, res: Response, next: NextFunction) => {
    req.session.userId = undefined;
    req.session.save((err) => {
      if (err) {
        return next(err);
      }

      req.session.regenerate((err) => {
        if (err) {
          return next(err);
        }
        res.send('200');
      });
    });
  }),
];

export const SessionsController = { get, create, remove };
