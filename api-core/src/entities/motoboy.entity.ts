import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entrega } from './entrega.entity';
import { PosicaoMotoboy } from './posicao-motoboy.entity';

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

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(() => Entrega, (entrega) => entrega.motoboy)
  entregas: Entrega[];

  @OneToMany(() => PosicaoMotoboy, (posicao) => posicao.motoboy)
  posicoes: PosicaoMotoboy[];
}
