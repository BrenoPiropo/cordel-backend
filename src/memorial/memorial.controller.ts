import { 
  Controller, Post, Get, Body, Param, Delete, Patch, 
  UseGuards, UseInterceptors, UploadedFiles, ParseIntPipe, Req 
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MemorialService } from './memorial.service';
import { CreateMemorialDto } from './dto/create-memorial.dto';
import { UpdateMemorialDto } from './dto/update-memorial.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('memorial')
export class MemorialController {
  constructor(private readonly memorialService: MemorialService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'foto', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
  ]))
  async create(
    @Body() createMemorialDto: CreateMemorialDto,
    @UploadedFiles() files: { foto?: Express.Multer.File[], pdf?: Express.Multer.File[] },
    @Req() req: any
  ) {
    const adminId = req.user.userId || req.user.id; 
    return this.memorialService.create(createMemorialDto, files, adminId);
  }

  @Get()
  findAll() {
    return this.memorialService.findAll();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.memorialService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.memorialService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'foto', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
  ]))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMemorialDto: UpdateMemorialDto,
    @UploadedFiles() files: { foto?: Express.Multer.File[], pdf?: Express.Multer.File[] }
  ) {
    return this.memorialService.update(id, updateMemorialDto, files);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.memorialService.remove(id);
  }
}