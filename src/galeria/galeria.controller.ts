import { 
  Controller, Get, Post, Body, Param, Delete, 
  UseInterceptors, UploadedFile, ParseIntPipe, UseGuards 
} from '@nestjs/common';
import { GaleriaService } from './galeria.service';
import { CreateGaleriaDto } from './dto/create-galeria.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from '../utils/file-upload.utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('galeria')
export class GaleriaController {
  constructor(private readonly galeriaService: GaleriaService) {}

  @Get()
  findAll() {
    return this.galeriaService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig('galeria') }))
  async create(
    @Body() dto: CreateGaleriaDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      dto.url = `/uploads/galeria/${file.filename}`;
    }
    return this.galeriaService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.galeriaService.remove(id);
  }
}