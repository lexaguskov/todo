import express from "express";
import path from "path";

import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3001;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("connected");
});

server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});