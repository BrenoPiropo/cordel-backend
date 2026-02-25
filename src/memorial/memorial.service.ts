import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Memorial } from './entities/memorial.entity';
import { PalavraChave } from './entities/palavra-chave.entity';
import { Referencia } from './entities/referencia.entity';
import { CreateMemorialDto } from './dto/create-memorial.dto';
import { UpdateMemorialDto } from './dto/update-memorial.dto';

@Injectable()
export class MemorialService {
  constructor(
    @InjectRepository(Memorial)
    private readonly memorialRepository: Repository<Memorial>,
    
    @InjectRepository(PalavraChave)
    private readonly palavraRepository: Repository<PalavraChave>,
    
    @InjectRepository(Referencia)
    private readonly referenciaRepository: Repository<Referencia>,
  ) {}

  async create(createMemorialDto: CreateMemorialDto) {
    const { palavras_chave, referencias_citadas, ...dadosAutor } = createMemorialDto;

    // 1. Gera o slug para a URL amigável (SEO/UX)
    const slug = dadosAutor.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');

    // 2. Resolve as Palavras-Chave (Reutiliza as existentes ou cria novas)
    const tags = palavras_chave ? await Promise.all(
      palavras_chave.map(async (p) => {
        let tag = await this.palavraRepository.findOne({ where: { termo: p.termo } });
        if (!tag) tag = this.palavraRepository.create(p);
        return tag;
      }),
    ) : [];

    // 3. Resolve as Referências Citadas
    const refs = referencias_citadas ? await Promise.all(
      referencias_citadas.map(async (r) => {
        let ref = await this.referenciaRepository.findOne({ 
          where: { nome_referencia: r.nome_referencia } 
        });
        if (!ref) ref = this.referenciaRepository.create(r);
        return ref;
      }),
    ) : [];
    // 4. Cria o registro completo com os relacionamentos N:N
    const novoAutor = this.memorialRepository.create({
      ...dadosAutor,
      slug,
      palavras_chave: tags,
      referencias_citadas: refs,
    });

    return await this.memorialRepository.save(novoAutor);
  }

  // Busca todos os autores trazendo as tags e quem publicou
  async findAll() {
    return await this.memorialRepository.find({
      relations: ['palavras_chave', 'referencias_citadas', 'admin'],
      order: { data_publicacao: 'DESC' },
    });
  }

  async findOne(id: number) {
    const autor = await this.memorialRepository.findOne({
      where: { id },
      relations: ['palavras_chave', 'referencias_citadas', 'admin'],
    });
    if (!autor) throw new NotFoundException('Autor não encontrado no Memorial');
    return autor;
  }
  async findBySlug(slug: string) {
  const item = await this.memorialRepository.findOne({ 
    where: { slug },
    relations: ['palavras_chave', 'referencias_citadas', 'admin'] // Adicione isso!
  });
  if (!item) throw new NotFoundException('Jurista não encontrado');
  return item;
}
  async update(id: number, updateMemorialDto: UpdateMemorialDto) {
    const autor = await this.findOne(id);
    
    // O merge do TypeORM lida com as alterações parciais (PATCH)
    this.memorialRepository.merge(autor, updateMemorialDto);
    return await this.memorialRepository.save(autor);
  }

  async remove(id: number) {
    const autor = await this.findOne(id);
    await this.memorialRepository.remove(autor);
    return { message: 'Autor removido com sucesso do Memorial' };
  }
}