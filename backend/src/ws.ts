// @ts-ignore
import { setupWSConnection } from "y-websocket/bin/utils";
import { Server } from 'ws';

// set up websocket server for yjs
const wss = new Server({ noServer: true });
wss.on('connection', setupWSConnection);
export const onUpgrade = (request: any, socket: any, head: any) => {
  // FIXME: perform authentication

  console.log('sess', request.session);
  console.log('user', request.user);

  const handleAuth = (ws: any) => {
    wss.emit('connection', ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
};

export default wss;