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
      .replace(/-+/g, '-');

    const novoPost = this.blogRepository.create({
      ...createBlogDto,
      slug,
    });

    return await this.blogRepository.save(novoPost);
  }

  async findAll() {
    return await this.blogRepository.find({
      relations: ['admin'],
      order: { data_criada: 'DESC' },
    });
  }
// Adicione este método ao seu BlogService
async findBySlug(slug: string) {
  const post = await this.blogRepository.findOne({
    where: { slug },
    relations: ['admin'], // Para mostrar quem escreveu
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

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const post = await this.findOne(id);
    this.blogRepository.merge(post, updateBlogDto);
    return await this.blogRepository.save(post);
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await this.blogRepository.remove(post);
    return { message: 'Postagem removida com sucesso' };
  }
}