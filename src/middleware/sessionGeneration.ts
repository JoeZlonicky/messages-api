import { User } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

// Requires a user member on the request
const sessionGeneration = expressAsyncHandler(
  (req: Request, _res: Response, next: NextFunction) => {
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
        next();
      });
    });
  },
);

export { sessionGeneration };
