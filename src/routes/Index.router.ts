import { IndexController } from './Index.controller';
import { UsersRouter } from './users/Users.router';
import { Router } from 'express';

const IndexRouter = Router();

IndexRouter.use('/users', UsersRouter);

IndexRouter.get('/', IndexController.get);

export { IndexRouter };
