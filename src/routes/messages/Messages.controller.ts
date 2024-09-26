import { MessagesModel } from './Messages.model';
import { MessagesValidator } from './Messages.validator';
import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

interface GetAllQueryParams {
  fromUserId?: number[];
  toUserId?: number[];
  afterId?: number;
}

type GetAllRequest = Request<unknown, unknown, unknown, GetAllQueryParams>;

const getAll = [
  ...MessagesValidator.getAll,
  expressAsyncHandler(async (req: GetAllRequest, res: Response) => {
    const fromUserIds = req.query.fromUserId || [];
    const toUserIds = req.query.toUserId || [];
    const afterId = req.query.afterId;

    const result = await MessagesModel.getAll(
      req.user!.id,
      fromUserIds,
      toUserIds,
      afterId,
    );

    res.json(result);
  }),
];

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
