import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToOne, 
  ManyToMany, 
  JoinTable, 
  JoinColumn, 
  CreateDateColumn 
} from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { PalavraChave } from './palavra-chave.entity';
import { Referencia } from './referencia.entity';

@Entity('autores_memorial')
export class Memorial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  nome: string;

  @Column({ length: 250, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  foto_url: string;

  @Column({ type: 'longtext' })
  biografia: string;

  @Column({ type: 'text', nullable: true })
  pdf_url: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @CreateDateColumn({ name: 'data_publicacao' })
  data_publicacao: Date;

  @ManyToOne(() => Auth)
  @JoinColumn({ name: 'admin_id' })
  admin: Auth;

  @Column()
  admin_id: number;

  @ManyToMany(() => PalavraChave, (palavra) => palavra.autores, { cascade: true })
  @JoinTable({
    name: 'autor_has_palavras',
    joinColumn: { name: 'autor_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'palavra_id', referencedColumnName: 'id' }
  })
  palavras_chave: PalavraChave[];

  @ManyToMany(() => Referencia, (ref) => ref.autores, { cascade: true })
  @JoinTable({
    name: 'autor_has_referencias',
    joinColumn: { name: 'autor_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'referencia_id', referencedColumnName: 'id' }
  })
  referencias_citadas: Referencia[];
}