import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeliveryStatus } from '../common/enums/delivery-status.enum';
import { Cliente } from './cliente.entity';
import { EventoEntrega } from './evento-entrega.entity';
import { Motoboy } from './motoboy.entity';

@Entity('entregas')
export class Entrega {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.entregas, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(() => Motoboy, (motoboy) => motoboy.entregas, { nullable: true, eager: true })
  @JoinColumn({ name: 'motoboy_id' })
  motoboy?: Motoboy;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column()
  endereco: string;

  @Column({ type: 'enum', enum: DeliveryStatus, default: DeliveryStatus.PENDENTE })
  status: DeliveryStatus;

  @Column({ name: 'ordem_rota', type: 'int', nullable: true })
  ordemRota?: number;

  @Column({ name: 'previsao_entrega', type: 'timestamptz', nullable: true })
  previsaoEntrega?: Date;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @OneToMany(() => EventoEntrega, (evento) => evento.entrega)
  eventos: EventoEntrega[];
}
