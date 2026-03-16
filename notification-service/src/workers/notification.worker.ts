import { Worker } from 'bullmq';
import { getRedisOptions } from '../config/queues';
import { sendWhatsApp } from '../channels/whatsapp';
import { sendSms } from '../channels/sms';
import { sendPush } from '../channels/push';
import { getDelivery } from '../services/marmitex.client';

const QUEUE_NAME = 'notificacoes.cliente';
const DEFAULT_MESSAGE = 'Sua entrega será a próxima...';

export interface NotificationJobPayload {
  motoboyId?: string;
  entregaId?: string;
  phone?: string;
  deviceId?: string;
  status?: string;
  message?: string;
}

const buildMessage = (jobName: string | undefined, payload: NotificationJobPayload) => {
  const base = payload.message?.trim() || DEFAULT_MESSAGE;
  const jobHint = (() => {
    switch (jobName) {
      case 'rota.proxima':
        return 'Rota otimizada';
      case 'cliente.proximo':
        return 'Próxima entrega em curso';
      case 'status.atualizado':
        return payload.status ? `Status ${payload.status}` : 'Status atualizado';
      default:
        return jobName ? `Evento ${jobName}` : 'Notificação';
    }
  })();
  const details = [];
  if (payload.entregaId) details.push(`entrega ${payload.entregaId}`);
  if (payload.motoboyId) details.push(`motoboy ${payload.motoboyId}`);
  if (payload.status && jobName !== 'status.atualizado') details.push(`status ${payload.status}`);
  const detailLabel = details.length ? ` (${details.join(' / ')})` : '';
  return `${base} · ${jobHint}${detailLabel}`;
};

export const startNotificationWorker = () => {
  const connection = getRedisOptions();

  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      const payload = job.data as NotificationJobPayload;
      const message = buildMessage(job.name, payload);
      const phone = payload.phone;
      const deviceId = payload.deviceId;

      console.log(`> [notificacao:${job.name || 'default'}] mensagem preparada: ${message}`);

      if (payload.entregaId && !phone) {
        try {
          const delivery = await getDelivery(payload.entregaId);
          if (delivery.customer?.phone) {
            payload.phone = delivery.customer.phone;
          }
        } catch (error) {
          console.warn('Não foi possível buscar a entrega para notificação', error);
        }
      }

      if (!phone && !deviceId) {
        console.warn('Sem canal configurado para notificação', payload);
      }

      const channelCalls = [] as Promise<unknown>[];
      if (phone) {
        channelCalls.push(sendWhatsApp(phone, message), sendSms(phone, message));
      }
      if (deviceId) {
        channelCalls.push(sendPush(deviceId, message));
      }

      await Promise.all(channelCalls);

      return { dispatched: true };
    },
    { connection },
  );

  worker.on('active', (job) => {
    console.log(`Job de notificação ${job.id} iniciado (${job.name ?? 'default'})`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job de notificação ${job?.id} falhou:`, err?.message);
  });

  return worker;
};
