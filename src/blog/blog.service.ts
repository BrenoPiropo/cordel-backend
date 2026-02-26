import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

 async create(createBlogDto: CreateBlogDto) {
    const slug = createBlogDto.titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Criamos a entidade respeitando os nomes exatos da sua blog.entity.ts
    const novoPost = this.blogRepository.create({
      titulo: createBlogDto.titulo,
      conteudo: createBlogDto.conteudo, // Mapeia para a coluna @Column({ name: 'texto' })
      imagem_url: createBlogDto.imagem_capa, // Mapeia imagem_capa do DTO para imagem_url da Entity
      slug: slug,
      admin_id: createBlogDto.admin_id,
    });

    return await this.blogRepository.save(novoPost);
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const post = await this.findOne(id);
    
    // Criamos um objeto de mapeamento para o merge não se perder
    const dadosParaAtualizar = {
      ...updateBlogDto,
      imagem_url: updateBlogDto.imagem_capa, // Garante a atualização do campo correto
    };

    this.blogRepository.merge(post, dadosParaAtualizar);
    return await this.blogRepository.save(post);
  }
  async findAll() {
    return await this.blogRepository.find({
      relations: ['admin'],
      order: { data_criada: 'DESC' },
    });
  }

  async findBySlug(slug: string) {
    const post = await this.blogRepository.findOne({
      where: { slug },
      relations: ['admin'], 
    });
    if (!post) throw new NotFoundException('Postagem não encontrada');
    return post;
  }

  async findOne(id: number) {
    const post = await this.blogRepository.findOne({
      where: { id },
      relations: ['admin'],
    });
    if (!post) throw new NotFoundException('Postagem não encontrada');
    return post;
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await this.blogRepository.remove(post);
    return { message: 'Postagem removida com sucesso' };
  }
}