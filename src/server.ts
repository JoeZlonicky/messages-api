import { app } from './app';
import { createSocketServer } from './ws/createSocketServer';
import { createServer } from 'http';

const server = createServer(app);
(async () => {
  await createSocketServer(server);
  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log(`Server open on http://localhost:${PORT}`);
  });
})().catch((error) => console.error(error));
