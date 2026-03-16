import { Queue } from 'bullmq';

const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
};

export const createNotificationsQueue = () =>
  new Queue('notificacoes.cliente', {
    connection: redisOptions,
  });
