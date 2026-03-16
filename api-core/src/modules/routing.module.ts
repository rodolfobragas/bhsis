import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveriesModule } from './deliveries.module';
import { Rota } from '../entities/rota.entity';
import { Entrega } from '../entities/entrega.entity';
import { RoutingController } from '../controllers/routing.controller';
import { RoutingService } from '../services/routing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Entrega, Rota]), DeliveriesModule],
  controllers: [RoutingController],
  providers: [RoutingService],
})
export class RoutingModule {}
