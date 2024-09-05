import { authRoute } from '../../middleware/authRoute';
import { MessagesController } from './Messages.controller';
import { Router } from 'express';

const MessagesRouter = Router();

MessagesRouter.use(authRoute);

// q: fromUserId? (supports multiple)
// q: toUserId? (supports multiple, -1 means to server)
MessagesRouter.get('/', MessagesController.get);

MessagesRouter.post('/', MessagesController.create);

export { MessagesRouter };
