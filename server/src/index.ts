import express from "express";
import path from "path";

import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const PORT = 3001;

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.static(path.join(__dirname, "public")));


io.on("connection", (socket) => {
  console.log("connected");

  socket.on('edit', (message) => {
    console.log('message', message);

    // go thru list of socket.io sockets and send message to everyone except the sender
    // socket.broadcast.emit('message', message);
    for (const sock of io.sockets.sockets) {
      if (sock[0] !== socket.id) {
        sock[1].emit('edit', message);
        console.log('sending message to', sock[0]);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
