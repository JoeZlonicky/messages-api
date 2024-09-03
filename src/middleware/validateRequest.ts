import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
    return;
  }

  const messages = errors.array().map((error) => {
    console.log(error);
    if (typeof error.msg === 'string') {
      return error.msg;
    } else {
      return 'Unknown error';
    }
  });
  res.status(400).send({ errors: messages });
}

export { validateRequest };
