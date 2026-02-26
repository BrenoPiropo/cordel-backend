import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institucional } from './entities/institucional.entity';
import { InstitucionalService } from './institucional.service';
import { InstitucionalController } from './institucional.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Institucional])],
  controllers: [InstitucionalController],
  providers: [InstitucionalService],
})
export class InstitucionalModule {}