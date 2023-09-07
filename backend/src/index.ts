import greenlock from 'greenlock-express';

import http from 'http';
import app from './express';
import { onUpgrade } from './ws';

import { BACKEND_HOSTNAME } from './settings';


// FIXME: use ENV === 'development' instead
const isDev = BACKEND_HOSTNAME?.includes('localhost')

if (isDev) {
  console.log('Running in dev mode, skip greenlock');
  const server = http.createServer(app);
  server.on('upgrade', onUpgrade); // attach websocket server
  server.listen(80);
} else {
  // Middleware configuration for Greenlock Express
  greenlock.init({
    packageRoot: '/app',
    configDir: '/var/greenlock.d',
    maintainerEmail: 'kvasdopil@gmail.com', // Replace with your email address
    cluster: false,
  }).ready((glx: any) => {
    const server = glx.httpsServer();
    server.on('upgrade', onUpgrade); // attach websocket server

    glx.serveApp(app); // serve express app on ports 80 and 443
  });
}