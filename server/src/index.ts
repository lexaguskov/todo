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
    io.emit('message', message); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
