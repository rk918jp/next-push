const express = require('express');
const {createServer} = require('node:http');
const {Server} = require('socket.io');
const WebSocket = require('ws');

const app = express();
const wss = new WebSocket.Server({ port: 3002 });
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

wss.on('connection', function connection(ws) {
  ws.on('message', (message) => {
    console.log('received: %s', message);
    wss.clients.forEach(client => client.send(message));
  });
  ws.send('something');
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('publish', (msg) => {
    console.log(`message: ${msg}`);
    io.emit('subscribe', msg);
  });
});

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});