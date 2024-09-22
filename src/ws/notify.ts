import { Message } from '@prisma/client';
import { Server } from 'socket.io';

function notify(io: Server, message: Message) {
  if (message.toUserId === null) {
    io.to('-1').emit('message', message);
  } else {
    io.to(`${message.toUserId}`).emit('message', message);
  }
}

export { notify };
