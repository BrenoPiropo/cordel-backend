import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GaleriaService } from './galeria.service';
import { GaleriaController } from './galeria.controller';
import { Galeria } from './entities/galeria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Galeria])],
  controllers: [GaleriaController],
  providers: [GaleriaService],
})
export class GaleriaModule {}