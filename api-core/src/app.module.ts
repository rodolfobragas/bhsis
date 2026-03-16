import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardModule } from './modules/dashboard.module';
import { DeliveriesModule } from './modules/deliveries.module';
import { MotoboysModule } from './modules/motoboys.module';
import { NotificationsModule } from './modules/notifications.module';
import { RoutingModule } from './modules/routing.module';
import { TrackingModule } from './modules/tracking.module';
import { QueueModule } from './queues/queue.module';
import { createTypeOrmOptions } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => createTypeOrmOptions(configService),
      inject: [ConfigService],
    }),
    QueueModule,
    DeliveriesModule,
    RoutingModule,
    TrackingModule,
    NotificationsModule,
    DashboardModule,
    MotoboysModule,
  ],
})
export class AppModule {}
