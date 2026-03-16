import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from '../entities/cliente.entity';
import { Entrega } from '../entities/entrega.entity';
import { Motoboy } from '../entities/motoboy.entity';
import { DeliveriesController } from '../controllers/deliveries.controller';
import { DeliveriesService } from '../services/deliveries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Entrega, Cliente, Motoboy])],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
  exports: [DeliveriesService],
})
export class DeliveriesModule {}
