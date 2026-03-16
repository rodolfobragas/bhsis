import { DataSource } from 'typeorm';
import { Server } from 'socket.io';
import { Queue } from 'bullmq';
import { Motoboy } from '../entities/motoboy.entity';
import { PosicaoMotoboy } from '../entities/posicao.entity';
import { listDeliveries, recordPosition } from './marmitex.client';

interface LocationPayload {
  latitude: number;
  longitude: number;
  speed?: number;
  timestamp?: string | number;
  status?: string;
}

interface MarmitexDeliverySnapshot {
  id: string;
  ordemRota?: number;
  status: string;
}

export class TrackingService {
  private readonly posicaoRepository = this.dataSource.getRepository(PosicaoMotoboy);
  private readonly motoboyRepository = this.dataSource.getRepository(Motoboy);

  constructor(
    private readonly dataSource: DataSource,
    private readonly io: Server,
    private readonly notificationQueue?: Queue,
  ) {}

  private normalizeTimestamp(input?: string | number): Date {
    if (!input) return new Date();
    return new Date(input);
  }

  private async persistAndBroadcast(motoboy: Motoboy, payload: LocationPayload) {
    const position = this.posicaoRepository.create({
      motoboy,
      latitude: payload.latitude,
      longitude: payload.longitude,
      speed: payload.speed,
      timestamp: this.normalizeTimestamp(payload.timestamp),
    });

    const saved = await this.posicaoRepository.save(position);

    const deliveries = await this.syncWithMarmitex(motoboy.id, payload);
    this.io.emit('posicao-motoboy', {
      motoboyId: motoboy.id,
      latitude: Number(saved.latitude),
      longitude: Number(saved.longitude),
      speed: saved.speed,
      timestamp: saved.timestamp,
      deliveries,
    });

    if (this.notificationQueue && payload.status === 'em_entrega') {
      await this.notificationQueue.add('cliente.proximo', { motoboyId: motoboy.id });
    }

    return saved;
  }

  async updateFromTraccar(payload: LocationPayload & { deviceId: string }) {
    const motoboy = await this.motoboyRepository.findOne({ where: { deviceIdTraccar: payload.deviceId } });
    if (!motoboy) {
      throw new Error('Motoboy nao encontrado para o deviceId informado');
    }
    return this.persistAndBroadcast(motoboy, payload);
  }

  async updateFromApp(payload: LocationPayload & { motoboyId: string }) {
    const motoboy = await this.motoboyRepository.findOne({ where: { id: payload.motoboyId } });
    if (!motoboy) {
      throw new Error('Motoboy nao encontrado');
    }
    return this.persistAndBroadcast(motoboy, payload);
  }

  private async syncWithMarmitex(motoboyId: string, payload: LocationPayload) {
    const deliveries = await listDeliveries(motoboyId);
    const active = deliveries.filter((delivery) =>
      ['NA_ROTA', 'EM_ENTREGA'].includes(delivery.status || ''),
    );

    await Promise.all(
      active.map((delivery) =>
        recordPosition(delivery.id, {
          latitude: payload.latitude,
          longitude: payload.longitude,
          speed: payload.speed,
          timestamp: typeof payload.timestamp === 'string' ? payload.timestamp : payload.timestamp?.toString(),
          motoboyId,
          status: payload.status,
        }),
      ),
    );

    return deliveries;
  }
}
