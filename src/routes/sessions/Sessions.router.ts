import { SessionsController } from './Sessions.controller';
import { Router } from 'express';

const SessionsRouter = Router();

SessionsRouter.post('/', ...SessionsController.create);

export { SessionsRouter };
