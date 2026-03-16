import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entrega } from './entrega.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  telefone: string;

  @Column()
  endereco: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @OneToMany(() => Entrega, (entrega) => entrega.cliente)
  entregas: Entrega[];
}
