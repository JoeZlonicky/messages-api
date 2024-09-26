import type { NextFunction, Request, Response } from 'express';

/* eslint-disable @typescript-eslint/no-unused-vars */
function serverError(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err.stack);
  res.type('txt').status(500).send('500 Internal Server Error');
}

export { serverError };
