import { parseQueryToIntegerArray } from '../../utility/parseQueryToIntegerArray';
import { MessagesModel } from './Messages.model';
import { MessageValidator } from './Messages.validator';
import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

const getAll = expressAsyncHandler(async (req: Request, res: Response) => {
  const fromIds = parseQueryToIntegerArray(
    req.query.fromUserId as string | string[] | undefined,
  );

  const toIds = parseQueryToIntegerArray(
    req.query.toUserId as string | string[] | undefined,
  );

  const result = await MessagesModel.getAll(req.user!.id, fromIds, toIds);

  res.json(result);
});

const create = [
  ...MessageValidator.create,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { toUserId, content } = req.body as {
      toUserId: string;
      content: string;
    };

    let toUserIdParsed: number | null = parseInt(toUserId);
    if (toUserIdParsed === -1) {
      toUserIdParsed = null;
    }

    const result = await MessagesModel.create(
      req.user!.id,
      toUserIdParsed,
      content,
    );

    res.json(result);
  }),
];

export const MessagesController = { getAll, create };
