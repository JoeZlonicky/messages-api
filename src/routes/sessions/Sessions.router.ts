import { SessionsController } from './Sessions.controller';
import { Router } from 'express';

const SessionsRouter = Router();

SessionsRouter.get('/', SessionsController.get);
SessionsRouter.post('/', SessionsController.create);
SessionsRouter.delete('/', SessionsController.remove);

export { SessionsRouter };
