import type { Request, Response } from 'express';

function pageNotFound(_req: Request, res: Response) {
  res.type('txt').status(404).send('404 Not Found');
}

export { pageNotFound };
