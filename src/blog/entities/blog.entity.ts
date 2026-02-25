import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';

// Altere de @Entity('posts_blog') para:
@Entity('blog_posts') 
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  titulo: string;

  @Column({ length: 250, unique: true })
  slug: string;

    @Column({ name: 'texto', type: 'longtext' }) 
    conteudo: string;
    
  @Column({ type: 'text', nullable: true })
  imagem_url: string;

  @CreateDateColumn({ name: 'data_criada' })
  data_criada: Date;

  @UpdateDateColumn({ name: 'data_atualizacao' })
  data_atualizacao: Date;

  @ManyToOne(() => Auth)
  @JoinColumn({ name: 'admin_id' })
  admin: Auth;

  @Column()
  admin_id: number;
}