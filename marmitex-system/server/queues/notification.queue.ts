import { Queue } from "bullmq";

const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
};

const notificationsQueue = new Queue("notificacoes.cliente", {
  connection: redisConnection,
});

export default notificationsQueue;
