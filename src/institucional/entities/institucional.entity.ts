import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('institucional')
export class Institucional {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  about_titulo: string;

  @Column({ type: 'longtext' })
  about_conteudo: string;

  @Column({ type: 'longtext' })
  valores_json: string; 
}