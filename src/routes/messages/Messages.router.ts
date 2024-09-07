import { protectedRoute } from '../../middleware/protectedRoute';
import { MessagesController } from './Messages.controller';
import { Router } from 'express';

const MessagesRouter = Router();

MessagesRouter.use(protectedRoute);

// q: fromUserId? (supports multiple)
// q: toUserId? (supports multiple, -1 means to server)
MessagesRouter.get('/', MessagesController.getAll);

MessagesRouter.post('/', MessagesController.create);

export { MessagesRouter };
