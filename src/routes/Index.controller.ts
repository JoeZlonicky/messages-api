import type { Request, Response } from 'express';

function get(_req: Request, res: Response) {
  res.json({ Hello: 'World' });
}

export const IndexController = { get };
