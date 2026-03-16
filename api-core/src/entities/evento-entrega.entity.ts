import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entrega } from './entrega.entity';

@Entity('eventos_entrega')
export class EventoEntrega {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Entrega, (entrega) => entrega.eventos, { eager: true })
  entrega: Entrega;

  @Column()
  tipo: string;

  @Column({ type: 'jsonb', nullable: true })
  detalhes?: Record<string, unknown>;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;
}
