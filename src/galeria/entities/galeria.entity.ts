import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('galeria')
export class Galeria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  url: string;

  @Column({ length: 255, nullable: true })
  legenda: string;

  @Column({
    type: 'enum',
    enum: ['EQUIPE', 'CARROSSEL'],
    default: 'EQUIPE'
  })
  tipo: string;

  @CreateDateColumn({ name: 'data_criada' })
  data_criada: Date;
}