import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from './cliente.entity';
import { Motoboy } from './motoboy.entity';

@Entity('entregas')
export class Entrega {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cliente_id' })
  clienteId: string;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ name: 'motoboy_id', nullable: true })
  motoboyId?: string;

  @ManyToOne(() => Motoboy, { nullable: true, eager: true })
  @JoinColumn({ name: 'motoboy_id' })
  motoboy?: Motoboy;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column()
  endereco: string;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'ordem_rota', type: 'int', nullable: true })
  ordemRota?: number;
}
