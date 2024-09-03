import { IndexController } from './Index.controller';
import { Router } from 'express';

const IndexRouter = Router();

IndexRouter.get('/', IndexController.get);

export { IndexRouter };
