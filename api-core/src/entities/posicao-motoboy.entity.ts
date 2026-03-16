import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Motoboy } from './motoboy.entity';

@Entity('posicoes_motoboy')
export class PosicaoMotoboy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Motoboy, (motoboy) => motoboy.posicoes, { eager: true })
  @JoinColumn({ name: 'motoboy_id' })
  motoboy: Motoboy;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ nullable: true, type: 'decimal', precision: 6, scale: 2 })
  speed?: number;

  @Column({ name: 'capturado_em', type: 'timestamptz' })
  timestamp: Date;
}
