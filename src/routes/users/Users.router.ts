import { UsersController } from './Users.controller';
import { Router } from 'express';

const UsersRouter = Router();

UsersRouter.get('/', UsersController.get);

export { UsersRouter };
