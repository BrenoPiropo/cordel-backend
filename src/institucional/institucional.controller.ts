import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { InstitucionalService } from './institucional.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateInstitucionalDto } from './dto/update-institucional.dto';
import { CreateInstitucionalDto } from './dto/create-institucional.dto';

@Controller('institucional')
export class InstitucionalController {
  constructor(private readonly service: InstitucionalService) {}

  @Get()
  getDados() {
    return this.service.getDados();
  }

  @UseGuards(JwtAuthGuard)
  @Post() // Usado para o "Upsert" (criar ou atualizar)
  async salvar(@Body() dto: CreateInstitucionalDto) {
    return this.service.salvar(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id') // Caso queira atualizar apenas um campo específico no futuro
  async atualizar(@Param('id') id: string, @Body() dto: UpdateInstitucionalDto) {
    return this.service.atualizar(+id, dto);
  }
}
