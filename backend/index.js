const express = require('express');
const {createServer} = require('node:http');
const {Server} = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('publish', (msg) => {
    console.log(`message: ${msg}`);
    io.emit('subscribe', msg);
  });
});

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});