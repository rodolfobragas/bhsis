import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Motoboy } from './motoboy.entity';

@Entity('rotas')
export class Rota {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Motoboy, { eager: true })
  @JoinColumn({ name: 'motoboy_id' })
  motoboy: Motoboy;

  @Column({ name: 'entregas_ids', type: 'jsonb', default: [] })
  entregasIds: string[];

  @Column({ type: 'jsonb', nullable: true })
  entregas?: unknown;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;
}
