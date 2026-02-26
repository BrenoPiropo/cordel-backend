import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Institucional } from './entities/institucional.entity';
import { CreateInstitucionalDto } from './dto/create-institucional.dto';
import { UpdateInstitucionalDto } from './dto/update-institucional.dto';

@Injectable()
export class InstitucionalService {
  constructor(
    @InjectRepository(Institucional)
    private readonly repo: Repository<Institucional>,
  ) {}

  /**
   * Retorna os dados institucionais. 
   * Como só existe um registro, buscamos sempre o ID 1.
   */
  async getDados(): Promise<Institucional> {
    const dados = await this.repo.findOne({ where: { id: 1 } });
    if (!dados) {
      // Se não houver nada no banco ainda, retornamos um objeto vazio ou erro amigável
      throw new NotFoundException('Dados institucionais ainda não configurados.');
    }
    return dados;
  }

  /**
   * Lógica de Upsert (Update or Insert).
   * Salva os dados sempre no ID 1, garantindo a unicidade.
   */
  async salvar(dto: CreateInstitucionalDto): Promise<Institucional> {
    // O método .save() do TypeORM entende que se enviarmos o ID 1, 
    // ele deve atualizar o registro existente em vez de criar um novo.
    return await this.repo.save({
      id: 1,
      ...dto,
    });
  }

  /**
   * Atualização parcial (PATCH).
   * Útil se você quiser atualizar apenas o AboutUs sem mexer nos Valores, por exemplo.
   */
// Altere de: async atualizar(dto: UpdateInstitucionalDto)
// Para:
async atualizar(id: number, dto: UpdateInstitucionalDto): Promise<Institucional> {
  const atual = await this.repo.findOne({ where: { id } }); // Usa o id recebido
  
  if (!atual) {
    throw new NotFoundException('Registro não encontrado');
  }

  const dadosAtualizados = this.repo.merge(atual, dto);
  return await this.repo.save(dadosAtualizados);
}
}