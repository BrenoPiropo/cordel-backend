import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemorialService } from './memorial.service';
import { MemorialController } from './memorial.controller';
import { Memorial } from './entities/memorial.entity';
import { PalavraChave } from './entities/palavra-chave.entity';
import { Referencia } from './entities/referencia.entity';

// src/memorial/memorial.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Memorial, PalavraChave, Referencia])],
  controllers: [MemorialController],
  providers: [MemorialService],
})
export class MemorialModule {}