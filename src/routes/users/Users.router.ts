import { UsersController } from './Users.controller';
import { Router } from 'express';

const UsersRouter = Router();

UsersRouter.get('/:id(\\d+)', UsersController.getById);
UsersRouter.patch('/:id(\\d+)', UsersController.update);

UsersRouter.get('/', UsersController.getAll);
UsersRouter.post('/', UsersController.create);

export { UsersRouter };
