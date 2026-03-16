import { Module } from '@nestjs/common';
import { DeliveriesModule } from './deliveries.module';
import { DashboardController } from '../controllers/dashboard.controller';

@Module({
  imports: [DeliveriesModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
