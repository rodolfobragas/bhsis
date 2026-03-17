import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Motoboy } from './motoboy.entity';

@Entity('entregas')
export class Entrega {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'motoboy_id', nullable: true })
  motoboyId?: string;

  @ManyToOne(() => Motoboy, { nullable: true, eager: true })
  @JoinColumn({ name: 'motoboy_id' })
  motoboy?: Motoboy;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'ordem_rota', type: 'int', nullable: true })
  ordemRota?: number;
}
