import { parseQueryToIntegerArray } from '../../utility/parseQueryToIntegerArray';
import { MessagesModel } from './Messages.model';
import { MessagesValidator } from './Messages.validator';
import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

const getAll = expressAsyncHandler(async (req: Request, res: Response) => {
  const fromUserIds = parseQueryToIntegerArray(
    req.query.fromUserId as string | string[] | undefined,
  );

  const toUserIds = parseQueryToIntegerArray(
    req.query.toUserId as string | string[] | undefined,
  );

  const afterId = parseQueryToIntegerArray(
    req.query.afterId as string | string[] | undefined,
  ).at(0);

  const result = await MessagesModel.getAll(
    req.user!.id,
    fromUserIds,
    toUserIds,
    afterId,
  );

  res.json(result);
});

const create = [
  ...MessagesValidator.create,
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
