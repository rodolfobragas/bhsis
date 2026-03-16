import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entrega } from '../entities/entrega.entity';
import { Motoboy } from '../entities/motoboy.entity';
import { PosicaoMotoboy } from '../entities/posicao-motoboy.entity';
import { TrackingController } from '../controllers/tracking.controller';
import { TrackingGateway } from '../gateways/tracking.gateway';
import { TrackingService } from '../services/tracking.service';
import { NotificationsModule } from './notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([PosicaoMotoboy, Motoboy, Entrega]), NotificationsModule],
  controllers: [TrackingController],
  providers: [TrackingService, TrackingGateway],
})
export class TrackingModule {}
