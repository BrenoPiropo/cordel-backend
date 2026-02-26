import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Galeria } from './entities/galeria.entity';
import { CreateGaleriaDto } from './dto/create-galeria.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GaleriaService {
  constructor(
    @InjectRepository(Galeria)
    private readonly galeriaRepository: Repository<Galeria>,
  ) {}

  async create(dto: CreateGaleriaDto) {
    const novaFoto = this.galeriaRepository.create(dto);
    return await this.galeriaRepository.save(novaFoto);
  }

  async findAll() {
    return await this.galeriaRepository.find({
      order: { data_criada: 'DESC' },
    });
  }

  async remove(id: number) {
    const foto = await this.galeriaRepository.findOne({ where: { id } });
    if (!foto) throw new NotFoundException('Imagem não encontrada');

    // Tenta remover o arquivo físico da pasta uploads
    const filePath = path.join(__dirname, '..', '..', '..', foto.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.galeriaRepository.remove(foto);
    return { message: 'Imagem removida com sucesso' };
  }
}