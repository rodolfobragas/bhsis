import express from 'express';
import { config } from 'dotenv';
import { createDataSource } from './config/data-source';
import { startRoutingWorker } from './queues/worker';

config();

async function bootstrap() {
  const port = Number(process.env.PORT || 3001);
  const dataSource = createDataSource();

  await dataSource.initialize();
  await startRoutingWorker(dataSource);

  const app = express();
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.listen(port, () => {
    console.log(`Routing service ouvindo em http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Erro ao iniciar routing service:', error);
  process.exit(1);
});
