import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('motoboys')
export class Motoboy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  telefone: string;

  @Column({ name: 'device_id_traccar', nullable: true })
  deviceIdTraccar?: string;
}
