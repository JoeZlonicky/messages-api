import { getNewMessages } from './getNewMessages';
import { getStartingId } from './getStartingId';
import { notify } from './notify';
import { Server } from 'socket.io';

const POLLING_TIME_MS = 1000.0;

async function startPolling(io: Server) {
  let lastId = await getStartingId();

  const poll = async () => {
    const newMessages = await getNewMessages(lastId);
    if (newMessages.length > 0) {
      lastId = newMessages.at(-1)?.id as number;
    }

    newMessages.forEach((message) => {
      notify(io, message);
    });

    setTimeout(() => {
      poll().catch((err) => console.error(err));
    }, POLLING_TIME_MS);
  };

  poll().catch((err) => console.error(err));
}

export { startPolling };
