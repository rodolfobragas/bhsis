import { Server } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import express from 'express';

export const createSocketApp = () => {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*' },
    path: '/realtime/socket.io',
  });

  io.on('connection', (socket) => {
    socket.emit('connected', { namespace: 'tracking' });
  });

  return { app, httpServer, io };
};
