import { IndexController } from './Index.controller';
import { MessagesRouter } from './messages/Messages.router';
import { SessionsRouter } from './sessions/Sessions.router';
import { UsersRouter } from './users/Users.router';
import { Router } from 'express';

const IndexRouter = Router();

IndexRouter.use('/messages', MessagesRouter);
IndexRouter.use('/sessions', SessionsRouter);
IndexRouter.use('/users', UsersRouter);

IndexRouter.get('/', IndexController.get);

export { IndexRouter };
