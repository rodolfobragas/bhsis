import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Queue } from 'bullmq';
import { ROUTE_OPTIMIZATION_QUEUE } from '../queues/queue.module';
import { Entrega } from '../entities/entrega.entity';
import { OptimizeRouteDto } from '../dto/optimize-route.dto';

@Injectable()
export class RoutingService {
  constructor(
    @InjectRepository(Entrega)
    private entregaRepository: Repository<Entrega>,
    @Inject(ROUTE_OPTIMIZATION_QUEUE) private readonly routeQueue: Queue,
  ) {}

  async optimizeRoute(dto: OptimizeRouteDto) {
    const entregas = await this.entregaRepository.findBy({ id: In(dto.entregaIds) });
    if (!entregas?.length) {
      throw new BadRequestException('Nenhuma entrega encontrada para otimizar');
    }

    const payload = {
      motoboyId: dto.motoboyId,
      entregaIds: dto.entregaIds,
      start: {
        latitude: dto.startLatitude,
        longitude: dto.startLongitude,
      },
    };

    const job = await this.routeQueue.add('rotas.otimizar', payload, { removeOnComplete: true });
    return { jobId: job.id, status: 'queued' };
  }
}
