import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { MemorialService } from './memorial.service';
import { MemorialController } from './memorial.controller';
import { Memorial } from './entities/memorial.entity';
import { PalavraChave } from './entities/palavra-chave.entity';
import { Referencia } from './entities/referencia.entity';

@Module({
  imports: [
    // 1. Configuração do Banco de Dados para as entidades do Memorial
    TypeOrmModule.forFeature([Memorial, PalavraChave, Referencia]),

    // 2. Configuração do Multer específica para este módulo
    MulterModule.register({
      storage: diskStorage({
        // Define o destino dos arquivos (pasta na raiz do projeto)
        destination: './uploads',
        filename: (req, file, cb) => {
          // Gera um sufixo único para evitar sobrescrever arquivos com o mesmo nome
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          // Retorna o nome final: campo-timestamp-random.extensao
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [MemorialController],
  providers: [MemorialService],
  exports: [MemorialService], // Exportar caso outro módulo precise usar a lógica do memorial
})
export class MemorialModule {}