import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  UseGuards 
} from '@nestjs/common';
import { MemorialService } from './memorial.service';
import { CreateMemorialDto } from './dto/create-memorial.dto';
import { UpdateMemorialDto } from './dto/update-memorial.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('memorial')
export class MemorialController {
  constructor(private readonly memorialService: MemorialService) {}

  /**
   * PROTEGIDO: Cria um novo autor no memorial.
   * Requer Bearer Token no cabeçalho da requisição.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createMemorialDto: CreateMemorialDto) {
    return this.memorialService.create(createMemorialDto);
  }

  /**
   * PÚBLICO: Lista todos os autores.
   * Usado para alimentar o Mapa Associativo no frontend.
   */
  @Get()
  findAll() {
    return this.memorialService.findAll();
  }
  @Get('slug/:slug') // Rota para a página dinâmica
  findBySlug(@Param('slug') slug: string) {
    return this.memorialService.findBySlug(slug);
  }
  /**
   * PÚBLICO: Retorna os detalhes de um autor específico pelo ID.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.memorialService.findOne(id);
  }

  /**
   * PROTEGIDO: Atualiza dados de um autor existente.
   * O UpdateMemorialDto permite o envio parcial de campos.
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateMemorialDto: UpdateMemorialDto
  ) {
    return this.memorialService.update(id, updateMemorialDto);
  }

  /**
   * PROTEGIDO: Remove um autor do memorial e do mapa.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.memorialService.remove(id);
  }
}