import { DataSource, In, Not } from 'typeorm';
import { Server } from 'socket.io';
import { Queue } from 'bullmq';
import { Entrega } from '../entities/entrega.entity';
import { Motoboy } from '../entities/motoboy.entity';
import { PosicaoMotoboy } from '../entities/posicao.entity';

interface LocationPayload {
  latitude: number;
  longitude: number;
  speed?: number;
  timestamp?: string | number;
  status?: string;
}

interface DeliverySnapshot {
  id: string;
  ordemRota?: number;
  status: string;
}

export class TrackingService {
  private readonly posicaoRepository = this.dataSource.getRepository(PosicaoMotoboy);
  private readonly motoboyRepository = this.dataSource.getRepository(Motoboy);
  private readonly entregaRepository = this.dataSource.getRepository(Entrega);

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

    const deliveries = await this.buildDeliverySnapshot(motoboy.id);
    this.io.emit('posicao-motoboy', {
      motoboyId: motoboy.id,
      latitude: Number(saved.latitude),
      longitude: Number(saved.longitude),
      speed: saved.speed,
      timestamp: saved.timestamp,
      deliveries,
    });

    if (this.notificationQueue && this.normalizeStatus(payload.status) === 'em_entrega') {
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

  private normalizeStatus(status?: string) {
    return status?.toString().toLowerCase();
  }

  private async buildDeliverySnapshot(motoboyId: string): Promise<DeliverySnapshot[]> {
    const excludedStatuses = ['entregue', 'cancelado'];
    const deliveries = await this.entregaRepository.find({
      where: { motoboyId, status: Not(In(excludedStatuses)) },
      order: { ordemRota: 'ASC' },
    });

    return deliveries.map((entrega) => ({
      id: entrega.id,
      ordemRota: entrega.ordemRota,
      status: entrega.status,
    }));
  }
}
