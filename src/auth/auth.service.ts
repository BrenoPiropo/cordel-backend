import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService, // Injeção necessária para gerar o token
  ) {}

  // Método para Registrar novos Administradores
  async create(createAuthDto: CreateAuthDto) {
    const { email, senha, nome } = createAuthDto;

    const userExists = await this.authRepository.findOne({ where: { email } });
    if (userExists) throw new ConflictException('E-mail já cadastrado');

    const salt = await bcrypt.genSalt();
    const senha_hash = await bcrypt.hash(senha, salt);

    const user = this.authRepository.create({
      nome,
      email,
      senha_hash,
    });

    // Ao salvar, o TypeORM retorna o objeto sem a senha devido ao select: false na Entity
    return this.authRepository.save(user);
  }

  // Método de Login e Geração de Token JWT
  async login(email: string, senha_plana: string) {
    // Buscamos o usuário e forçamos o select da senha_hash para comparação
    const user = await this.authRepository.findOne({
      where: { email },
      select: ['id', 'nome', 'email', 'senha_hash'], 
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // Comparamos a senha enviada com o hash do banco
    const senhaValida = await bcrypt.compare(senha_plana, user.senha_hash);

    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // Criamos o Payload (dados que ficarão dentro do token)
    const payload = { 
      sub: user.id, 
      email: user.email,
      nome: user.nome 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email
      }
    };
  }

  async findAll() {
    return this.authRepository.find();
  }
  async remove(id: number) {
  // Busca o usuário para garantir que ele existe
  const user = await this.authRepository.findOne({ where: { id } });
  
  if (!user) {
    throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
  }

  return await this.authRepository.remove(user);
}
  async findOne(id: number) {
    return this.authRepository.findOneBy({ id });
  }
}