import greenlock from 'greenlock-express';
// @ts-ignore
import { setupWSConnection } from "y-websocket/bin/utils";
import { Server } from 'ws';

import app from './express';

// set up websocket server for yjs
const wss = new Server({ noServer: true });
wss.on('connection', setupWSConnection);

// Middleware configuration for Greenlock Express
greenlock.init({
  packageRoot: '/app',
  configDir: '/var/greenlock.d',
  maintainerEmail: 'kvasdopil@gmail.com', // Replace with your email address
  cluster: false,
}).ready((glx: any) => {
  const server = glx.httpsServer();
  server.on('upgrade', (request: any, socket: any, head: any) => {
    // FIXME: perform authentication

    const handleAuth = (ws: any) => {
      wss.emit('connection', ws, request)
    }
    wss.handleUpgrade(request, socket, head, handleAuth)
  });

  glx.serveApp(app); // serve express app on ports 80 and 443
});
