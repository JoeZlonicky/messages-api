import { prisma } from '../prisma/prisma';
import type { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

const authRoute = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      res.type('text').status(401).send('401 Requires Authentication');
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
    });

    if (!user) {
      res.type('text').status(401).send('401 Authentication failed');
      return;
    }

    req.user = user;
    next();
  },
);

export { authRoute };
