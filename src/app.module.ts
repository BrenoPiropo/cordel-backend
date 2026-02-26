import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Importe seus módulos aqui
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { MemorialModule } from './memorial/memorial.module';
import { GaleriaModule } from './galeria/galeria.module';
import { InstitucionalModule } from './institucional/institucional.module';

@Module({
  imports: [
    // 1. Configuração do Banco de Dados (Certifique-se que os dados estão corretos)
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Minerva123', 
      database: 'cordel',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Cuidado: em produção use false
    }),

    // 2. Configuração Global do Multer para Uploads
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Garanta que essa pasta exista na raiz do projeto
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),

    // 3. Seus Módulos Funcionais
    AuthModule,
    BlogModule,
    MemorialModule,
    GaleriaModule,
    InstitucionalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}