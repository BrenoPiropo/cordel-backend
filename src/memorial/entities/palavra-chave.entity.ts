import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Memorial } from './memorial.entity';

@Entity('palavras_chave')
export class PalavraChave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  termo: string;

  @ManyToMany(() => Memorial, (memorial) => memorial.palavras_chave)
  autores: Memorial[];
}