import { app } from './app';
import { socket } from './socket';
import { createServer } from 'http';

const server = createServer(app);
socket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server open on http://localhost:${PORT}`);
});
