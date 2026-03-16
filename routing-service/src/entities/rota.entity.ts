import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rotas')
export class Rota {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'motoboy_id' })
  motoboyId: string;

  @Column({ name: 'entregas_ids', type: 'jsonb' })
  entregasIds: string[];

  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, unknown>;
}
