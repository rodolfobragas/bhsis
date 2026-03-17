import { DataSource, In, Not } from 'typeorm';
import { Queue, Worker } from 'bullmq';
import { GraphhopperService } from '../services/graphhopper.service';
import { Entrega } from '../entities/entrega.entity';
import { Rota } from '../entities/rota.entity';

const REDIS_OPTIONS = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
};

const notificationsQueue = new Queue('notificacoes.cliente', {
  connection: REDIS_OPTIONS,
});

export const startRoutingWorker = async (dataSource: DataSource) => {
  const repository = dataSource.getRepository(Entrega);
  const rotaRepository = dataSource.getRepository(Rota);
  const graphhopperUrl = process.env.GRAPHOPPER_VRP_URL;
  if (!graphhopperUrl) {
    throw new Error('GRAPHOPPER_VRP_URL nao configurado');
  }

  const graphhopper = new GraphhopperService(graphhopperUrl);

  const worker = new Worker(
    'rotas.otimizar',
    async (job) => {
      const { motoboyId, entregaIds, start } = job.data as {
        motoboyId: string;
        entregaIds: string[];
        start?: { latitude?: number; longitude?: number };
      };

      const excludedStatuses = ['entregue', 'cancelado'];
      const activeDeliveries = await repository.find({
        where: { motoboyId, status: Not(In(excludedStatuses)) },
      });
      const ids = entregaIds.length ? entregaIds : activeDeliveries.map((d) => d.id);

      const entregas = await repository.findBy({ id: In(ids) });
      if (!entregas?.length) {
        throw new Error('Nenhuma entrega encontrada para o job');
      }

      const first = entregas[0];
      const defaultStart = {
        latitude: start?.latitude ?? first.latitude,
        longitude: start?.longitude ?? first.longitude,
      };

      const payload = {
        vehicles: [
          {
            vehicle_id: `motoboy-${motoboyId}`,
            type_id: 'motoboy',
            start_address: {
              lat: Number(defaultStart.latitude),
              lon: Number(defaultStart.longitude),
            },
          },
        ],
        shipments: entregas.map((entrega) => ({
          shipment_id: entrega.id,
          address: { lat: Number(entrega.latitude), lon: Number(entrega.longitude) },
          size: [1],
        })),
        configuration: {
          routing: {
            service: 'vrp',
          },
        },
      };

      const solution = await graphhopper.optimizeRoute(payload);
      const route = solution?.solution?.routes?.[0];
      if (!route) {
        throw new Error('Graphhopper nao retornou rota valida');
      }

      type Activity = { type: string; shipment_id?: string };
      const activities = (route.activities ?? []).filter(
        (act: Activity): act is Activity => act.type === 'service' && !!act.shipment_id,
      );
      let ordem = 1;
      let nextDeliveryToNotify:
        | {
            entregaId: string;
            motoboyId: string;
            phone?: string;
            deviceId?: string;
          }
        | null = null;

      for (const activity of activities) {
        const entregaId = String(activity.shipment_id);
        await repository.update(entregaId, { ordemRota: ordem, status: 'na_rota' });
        const updatedDelivery = await repository.findOne({ where: { id: entregaId } });
        if (ordem === 1 && updatedDelivery) {
          nextDeliveryToNotify = {
            entregaId: updatedDelivery.id,
            motoboyId,
            phone: updatedDelivery.cliente?.telefone,
            deviceId: updatedDelivery.motoboy?.deviceIdTraccar,
          };
        }
        ordem += 1;
      }

      if (nextDeliveryToNotify) {
        try {
          await notificationsQueue.add('rota.proxima', nextDeliveryToNotify);
        } catch (error) {
          console.warn('Falha ao agendar rota.proxima', error);
        }
      }

      const rota = rotaRepository.create({
        motoboyId,
        entregasIds: entregaIds,
        payload: route,
      });
      await rotaRepository.save(rota);

      return { rotaId: rota.id };
    },
    { connection: REDIS_OPTIONS },
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} concluido`);
  });
  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} falhou:`, err.message);
  });

  return worker;
};
