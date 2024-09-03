import { SessionsValidator } from './Sessions.validator';
import type { User } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';

const create = [
  ...SessionsValidator.create,
  (req: Request, res: Response, next: NextFunction) => {
    req.session.regenerate((err?: Error) => {
      if (err) {
        return next(err);
      }

      const user = req.user as User;
      req.session.userId = user.id;

      req.session.save((err?: Error) => {
        if (err) {
          return next(err);
        }
        res.json({ id: user.id, displayName: user.displayName });
      });
    });
  },
];

export const SessionsController = { create };
