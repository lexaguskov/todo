import greenlock from 'greenlock-express';

import app from './express';

// Middleware configuration for Greenlock Express
greenlock.init({
  packageRoot: '/app',
  configDir: '/var/greenlock.d',
  maintainerEmail: 'kvasdopil@gmail.com', // Replace with your email address
  cluster: false,
}).serve(app);

// // Your Express app's routes and middleware
// app.get('/', (req, res) => {
//   res.send('Hello, HTTPS!');
// });

// Start your Express app
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// // @ts-ignore
// import { setupWSConnection } from "y-websocket/bin/utils";

// const wss = new Server({ noServer: true });

// const server = createServer(app);

// server.on('upgrade', (request, socket, head) => {
//   // FIXME: perform authentication

//   const handleAuth = (ws: any) => {
//     wss.emit('connection', ws, request)
//   }
//   wss.handleUpgrade(request, socket, head, handleAuth)
// });

// wss.on('connection', setupWSConnection);

// import { Server } from 'ws';

// import { createServer } from "http";
