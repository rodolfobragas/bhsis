import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';

export const ROUTE_OPTIMIZATION_QUEUE = 'ROUTE_OPTIMIZATION_QUEUE';

const routeQueueProvider = {
  provide: ROUTE_OPTIMIZATION_QUEUE,
  useFactory: (configService: ConfigService) => {
    const host = configService.get<string>('REDIS_HOST', 'localhost');
    const port = Number(configService.get<number>('REDIS_PORT', 6379));
    const password = configService.get<string>('REDIS_PASSWORD', '');

    return new Queue('rotas.otimizar', {
      connection: {
        host,
        port,
        password: password || undefined,
      },
    });
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [routeQueueProvider],
  exports: [routeQueueProvider],
})
export class QueueModule {}
