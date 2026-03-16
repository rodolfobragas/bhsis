import { DataSource } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { Entrega } from '../entities/entrega.entity';
import { Motoboy } from '../entities/motoboy.entity';
import { Rota } from '../entities/rota.entity';

export const createDataSource = () =>
  new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT || 5432),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'delivery',
    entities: [Entrega, Cliente, Motoboy, Rota],
    synchronize: false,
    logging: false,
  });
