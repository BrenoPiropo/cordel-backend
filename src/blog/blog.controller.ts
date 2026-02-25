import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  UseGuards, 
  UseInterceptors, 
  UploadedFile 
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from '../utils/file-upload.utils';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  /**
   * PROTEGIDO: Cria um post com upload de imagem de capa.
   * O Interceptor 'imagem' deve bater com o nome do campo enviado no Insomnia (Multipart Form).
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('imagem', { storage: storageConfig('blog') }))
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Se um arquivo foi enviado, anexamos o caminho ao DTO antes de salvar no banco
    if (file) {
      createBlogDto.imagem_capa = `/uploads/blog/${file.filename}`;
    }
    
    return this.blogService.create(createBlogDto);
  }
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }
  /**
   * PÚBLICO: Lista todos os posts do blog para os visitantes.
   */
  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  /**
   * PÚBLICO: Busca um post específico pelo ID.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findOne(id);
  }

  /**
   * PROTEGIDO: Atualiza um post. Também permite atualizar a imagem de capa.
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagem', { storage: storageConfig('blog') }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateBlogDto.imagem_capa = `/uploads/blog/${file.filename}`;
    }
    return this.blogService.update(id, updateBlogDto);
  }

  /**
   * PROTEGIDO: Remove uma postagem.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.remove(id);
  }
}