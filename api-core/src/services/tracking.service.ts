import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { DeliveryStatus } from '../common/enums/delivery-status.enum';
import { Motoboy } from '../entities/motoboy.entity';
import { PosicaoMotoboy } from '../entities/posicao-motoboy.entity';
import { Entrega } from '../entities/entrega.entity';
import { TrackingGateway } from '../gateways/tracking.gateway';
import { DeliverySnapshotDto } from '../dto/delivery-snapshot.dto';
import { MotoboyLocationDto } from '../dto/motoboy-location.dto';
import { TraccarTrackingDto } from '../dto/traccar-tracking.dto';
import { NotificationsService } from './notifications.service';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(PosicaoMotoboy)
    private readonly posicaoRepository: Repository<PosicaoMotoboy>,
    @InjectRepository(Motoboy)
    private readonly motoboyRepository: Repository<Motoboy>,
    @InjectRepository(Entrega)
    private readonly entregaRepository: Repository<Entrega>,
    private readonly gateway: TrackingGateway,
    private readonly notificationService: NotificationsService,
  ) {}

  async updateFromMotoboy(dto: MotoboyLocationDto) {
    const motoboy = await this.motoboyRepository.findOne({ where: { id: dto.motoboyId } });
    if (!motoboy) {
      throw new NotFoundException('Motoboy nao encontrado');
    }

    const position = this.posicaoRepository.create({
      motoboy,
      latitude: dto.latitude,
      longitude: dto.longitude,
      speed: dto.speed,
      timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
    });

    const saved = await this.posicaoRepository.save(position);
    const deliveries = await this.buildDeliverySnapshot(motoboy);
    this.gateway.broadcastPosition(saved, deliveries);

    if (dto.status === DeliveryStatus.EM_ENTREGA) {
      await this.notificationService.notifyClientNextDelivery(motoboy.id);
    }

    return saved;
  }

  async updateFromTraccar(dto: TraccarTrackingDto) {
    const motoboy = await this.motoboyRepository.findOne({ where: { deviceIdTraccar: dto.deviceId } });
    if (!motoboy) {
      throw new NotFoundException('Motoboy do dispositivo nao encontrado');
    }

    const position = this.posicaoRepository.create({
      motoboy,
      latitude: dto.latitude,
      longitude: dto.longitude,
      speed: dto.speed,
      timestamp: new Date(dto.timestamp),
    });

    const saved = await this.posicaoRepository.save(position);
    const deliveries = await this.buildDeliverySnapshot(motoboy);
    this.gateway.broadcastPosition(saved, deliveries);
    return saved;
  }

  private async buildDeliverySnapshot(motoboy: Motoboy): Promise<DeliverySnapshotDto[]> {
    const excluded = [DeliveryStatus.ENTREGUE, DeliveryStatus.CANCELADO];
    const deliveries = await this.entregaRepository.find({
      where: {
        motoboy,
        status: Not(In(excluded)),
      },
      order: { ordemRota: 'ASC' },
    });

    return deliveries.map((entrega) => ({
      id: entrega.id,
      ordemRota: entrega.ordemRota,
      status: entrega.status,
    }));
  }
}
