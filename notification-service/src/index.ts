import express from 'express';
import { config } from 'dotenv';
import { startNotificationWorker } from './workers/notification.worker';

config();

async function bootstrap() {
  const port = Number(process.env.PORT || 3010);
  startNotificationWorker();

  const app = express();
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.listen(port, () => {
    console.log(`Notification service ouvindo em http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Erro ao iniciar Notification Service', error);
  process.exit(1);
});
