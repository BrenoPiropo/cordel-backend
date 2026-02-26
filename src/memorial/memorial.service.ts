import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Memorial } from './entities/memorial.entity';
import { CreateMemorialDto } from './dto/create-memorial.dto';
import { UpdateMemorialDto } from './dto/update-memorial.dto';

@Injectable()
export class MemorialService {
  constructor(
    @InjectRepository(Memorial)
    private readonly memorialRepository: Repository<Memorial>,
  ) {}

  async create(dto: CreateMemorialDto, files: any, adminId: number) {
    // 1. Geração de Slug
    const slug = dto.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // 2. Caminhos dos arquivos
    const foto_url = files?.foto ? `/uploads/${files.foto[0].filename}` : null;
    const pdf_url = files?.pdf ? `/uploads/${files.pdf[0].filename}` : null;

    // 3. Parse seguro de JSON (Tags e Referências)
    let tagsJson = [];
    let refsJson = [];
    try {
      if (dto.palavras_chave) tagsJson = JSON.parse(dto.palavras_chave);
      if (dto.referencias_citadas) refsJson = JSON.parse(dto.referencias_citadas);
    } catch (e) {
      console.error("Erro no parse de JSON:", e);
    }

    // 4. Criação da Entidade
    const novoAutor = this.memorialRepository.create({
      ...dto, // Agora inclui 'autoras' e 'revisao' vindos do DTO
      slug,
      latitude: parseFloat(dto.latitude),
      longitude: parseFloat(dto.longitude),
      foto_url,
      pdf_url,
      admin: { id: adminId } as any,
      palavras_chave: tagsJson,
      referencias_citadas: refsJson,
    });

    return await this.memorialRepository.save(novoAutor);
  }

  async findAll() {
    return await this.memorialRepository.find({
      relations: ['admin'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    // Adicionado relações aqui também para garantir que a edição carregue as tags/refs
    const autor = await this.memorialRepository.findOne({ 
      where: { id },
      relations: ['admin', 'palavras_chave', 'referencias_citadas'] 
    });
    if (!autor) throw new NotFoundException('Autor não encontrado.');
    return autor;
  }

  async findBySlug(slug: string) {
    const item = await this.memorialRepository.findOne({ 
      where: { slug },
      relations: ['palavras_chave', 'referencias_citadas', 'admin'] 
    });
    
    if (!item) throw new NotFoundException('Jurista não encontrado no memorial.');
    return item;
  }

  // No memorial.service.ts

async update(id: number, dto: UpdateMemorialDto, files: any) {
  const autor = await this.findOne(id);

  const foto_url = files?.foto ? `/uploads/${files.foto[0].filename}` : autor.foto_url;
  const pdf_url = files?.pdf ? `/uploads/${files.pdf[0].filename}` : autor.pdf_url;

  // 1. Parse seguro dos campos JSON
  let tagsInput = [];
  let refsInput = [];
  try {
    if (dto.palavras_chave) tagsInput = JSON.parse(dto.palavras_chave);
    if (dto.referencias_citadas) refsInput = JSON.parse(dto.referencias_citadas);
  } catch (e) {
    tagsInput = autor.palavras_chave;
    refsInput = autor.referencias_citadas;
  }

  // 2. Lógica para evitar Duplicação nas Palavras-Chave
  const palavras_chave = await Promise.all(
    tagsInput.map(async (t: any) => {
      // Procura se o termo já existe
      let tag = await this.memorialRepository.manager.findOne('PalavraChave', { where: { termo: t.termo } });
      // Se não existe, cria o objeto para o TypeORM inserir
      if (!tag) tag = this.memorialRepository.manager.create('PalavraChave', { termo: t.termo });
      return tag;
    })
  );

  // 3. Lógica para evitar Duplicação nas Referências
  const referencias_citadas = await Promise.all(
    refsInput.map(async (r: any) => {
      let ref = await this.memorialRepository.manager.findOne('Referencia', { where: { nome_referencia: r.nome_referencia } });
      if (!ref) ref = this.memorialRepository.manager.create('Referencia', { nome_referencia: r.nome_referencia });
      return ref;
    })
  );

  const dadosAtualizados = {
    ...dto,
    foto_url,
    pdf_url,
    latitude: dto.latitude ? parseFloat(dto.latitude) : autor.latitude,
    longitude: dto.longitude ? parseFloat(dto.longitude) : autor.longitude,
    palavras_chave, // Atribui os objetos já verificados
    referencias_citadas, // Atribui os objetos já verificados
  };

  this.memorialRepository.merge(autor, dadosAtualizados);
  return await this.memorialRepository.save(autor);
}
  async remove(id: number) {
    const autor = await this.findOne(id);
    await this.memorialRepository.remove(autor);
    return { message: 'Registro removido com sucesso.' };
  }
}