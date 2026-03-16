import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryStatus } from '../common/enums/delivery-status.enum';
import { Cliente } from '../entities/cliente.entity';
import { Entrega } from '../entities/entrega.entity';
import { Motoboy } from '../entities/motoboy.entity';
import { CreateEntregaDto } from '../dto/create-entrega.dto';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Entrega)
    private entregaRepository: Repository<Entrega>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(Motoboy)
    private motoboyRepository: Repository<Motoboy>,
  ) {}

  async create(dto: CreateEntregaDto): Promise<Entrega> {
    const cliente = await this.clienteRepository.findOne({ where: { id: dto.clienteId } });
    if (!cliente) {
      throw new NotFoundException('Cliente nao encontrado');
    }

    const motoboy = dto.motoboyId
      ? await this.motoboyRepository.findOne({ where: { id: dto.motoboyId } })
      : undefined;

    const entrega = this.entregaRepository.create();
    entrega.cliente = cliente;
    if (motoboy) {
      entrega.motoboy = motoboy;
    }
    entrega.latitude = dto.latitude;
    entrega.longitude = dto.longitude;
    entrega.endereco = dto.endereco;
    entrega.previsaoEntrega = dto.previsaoEntrega ? new Date(dto.previsaoEntrega) : undefined;
    entrega.status = DeliveryStatus.PENDENTE;

    return this.entregaRepository.save(entrega);
  }

  findAll(): Promise<Entrega[]> {
    return this.entregaRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Entrega> {
    const entrega = await this.entregaRepository.findOne({ where: { id } });
    if (!entrega) {
      throw new NotFoundException('Entrega nao encontrada');
    }
    return entrega;
  }

  async updateRouteOrder(entregaId: string, ordem: number): Promise<void> {
    await this.entregaRepository.update(entregaId, { ordemRota: ordem, status: DeliveryStatus.NA_ROTA });
  }

  async getDashboardSummary(): Promise<Record<string, unknown>> {
    const statusGroups = await this.entregaRepository
      .createQueryBuilder('entrega')
      .select('entrega.status', 'status')
      .addSelect('COUNT(*)', 'quantidade')
      .groupBy('entrega.status')
      .getRawMany();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const entregasHoje = await this.entregaRepository
      .createQueryBuilder('entrega')
      .where('entrega.created_at >= :today', { today: today.toISOString() })
      .getCount();

    const avgQuery = await this.entregaRepository
      .createQueryBuilder('entrega')
      .select('AVG(EXTRACT(EPOCH FROM (entrega.previsao_entrega - entrega.created_at)))', 'mediaSegundos')
      .where('entrega.previsao_entrega IS NOT NULL')
      .getRawOne();

    const entEmAndamento = Number(
      statusGroups.find((item) => item.status === DeliveryStatus.EM_ENTREGA)?.quantidade ?? 0,
    );

    return {
      status: statusGroups.reduce((acc, item) => ({ ...acc, [item.status]: Number(item.quantidade) }), {}),
      entregasHoje,
      entregasEmAndamento: entEmAndamento,
      tempoMedioEntregaSegundos: avgQuery?.mediaSegundos ? Number(avgQuery.mediaSegundos) : null,
    };
  }
}
