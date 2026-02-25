import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { MemorialModule } from './memorial/memorial.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Minerva123', 
      database: 'cordel',
      // O padrão abaixo busca automaticamente por .entity.ts em todas as pastas
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, 
    }),
    AuthModule,
    BlogModule,
    MemorialModule,
  ],
})
export class AppModule {}