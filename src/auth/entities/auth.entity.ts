import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios_admin')
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha_hash: string;
}