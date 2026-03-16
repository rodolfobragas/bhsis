import express from 'express';
import { config } from 'dotenv';
import { createDataSource } from './config/data-source';
import { createNotificationsQueue } from './config/queues';
import { createSocketApp } from './websocket/socket-server';
import { TrackingService } from './services/tracking.service';

config();

async function bootstrap() {
  const port = Number(process.env.PORT || 3002);
  const dataSource = createDataSource();
  await dataSource.initialize();

  const { app, httpServer, io } = createSocketApp();
  const notificationQueue = createNotificationsQueue();
  const trackingService = new TrackingService(dataSource, io, notificationQueue);

  app.use(express.json());

  app.post('/tracking/update', async (req, res) => {
    try {
      const payload = { ...req.body };
      const saved = await trackingService.updateFromTraccar(payload);
      res.json({ id: saved.id });
    } catch (error) {
      res.status(400).json({ message: 'Erro no webhook Traccar', detail: String(error) });
    }
  });

  app.post('/motoboy/localizacao', async (req, res) => {
    try {
      const payload = req.body;
      const saved = await trackingService.updateFromApp(payload);
      res.json({ id: saved.id });
    } catch (error) {
      res.status(400).json({ message: 'Erro ao atualizar localizacao do motoboy', detail: String(error) });
    }
  });

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  httpServer.listen(port, () => {
    console.log(`Tracking service ouvindo em http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Falha ao iniciar tracking service', error);
  process.exit(1);
});
