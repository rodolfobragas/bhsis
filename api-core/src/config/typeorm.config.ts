import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Cliente } from '../entities/cliente.entity';
import { Entrega } from '../entities/entrega.entity';
import { EventoEntrega } from '../entities/evento-entrega.entity';
import { Motoboy } from '../entities/motoboy.entity';
import { PosicaoMotoboy } from '../entities/posicao-motoboy.entity';
import { Rota } from '../entities/rota.entity';

export const createTypeOrmOptions = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  username: configService.get<string>('DATABASE_USER', 'postgres'),
  password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
  database: configService.get<string>('DATABASE_NAME', 'delivery'),
  entities: [Motoboy, Cliente, Entrega, Rota, PosicaoMotoboy, EventoEntrega],
  synchronize: false,
  migrationsRun: false,
  logging: false,
});
