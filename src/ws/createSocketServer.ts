import { authSession } from '../middleware/authSession';
import { protectedRoute } from '../middleware/protectedRoute';
import { startPolling } from './startPolling';
import { SessionData } from 'express-session';
import { Server as HttpServer, IncomingMessage } from 'http';
import { Server as WebSocketServer } from 'socket.io';

interface AuthenticatedRequest extends IncomingMessage {
  session?: SessionData;
}

async function createSocketServer(httpServer: HttpServer) {
  const io = new WebSocketServer(httpServer, {
    cors: {
      credentials: true,
      origin: true,
    },
    transports: ['polling', 'websocket'],
    allowEIO3: true,
  });

  io.engine.use(authSession);
  io.engine.use(protectedRoute);

  await startPolling(io);

  io.on('connection', async (socket) => {
    const req = socket.request as AuthenticatedRequest;
    const userId = req?.session?.userId;
    if (!userId) {
      return;
    }

    await socket.join('-1');
    await socket.join(`${userId}`);
  });
}

export { createSocketServer };
