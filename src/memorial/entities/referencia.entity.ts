import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Memorial } from './memorial.entity';

@Entity('referencias_citadas')
export class Referencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250, unique: true })
  nome_referencia: string;

  @ManyToMany(() => Memorial, (memorial) => memorial.referencias_citadas)
  autores: Memorial[];
}