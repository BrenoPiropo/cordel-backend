import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity'; 
import { CreateAuthDto } from './create-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) // Alterado para Auth
    private readonly authRepository: Repository<Auth>,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const { email, senha, nome } = createAuthDto;

    // Busca usando a entidade correta
    const userExists = await this.authRepository.findOne({ where: { email } });
    if (userExists) throw new ConflictException('E-mail já cadastrado');

    const salt = await bcrypt.genSalt();
    const senha_hash = await bcrypt.hash(senha, salt);

    const user = this.authRepository.create({
      nome,
      email,
      senha_hash,
    });

    return this.authRepository.save(user);
  }

  async findAll() {
    return this.authRepository.find();
  }

  async findOne(id: number) {
    // Busca pelo ID
    return this.authRepository.findOneBy({ id });
  }
}