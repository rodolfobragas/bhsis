import { DataSource } from 'typeorm';
import { Motoboy } from '../entities/motoboy.entity';
import { PosicaoMotoboy } from '../entities/posicao.entity';

export const createDataSource = () =>
  new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT || 5432),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'delivery',
    entities: [Motoboy, PosicaoMotoboy],
    synchronize: false,
    logging: false,
  });
