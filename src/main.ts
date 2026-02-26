import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; // IMPORTANTE
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. Adicionamos o tipo <NestExpressApplication> para habilitar funções de servidor de arquivos
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 2. Configuração do CORS (Mantive sua lógica)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. Habilita a pasta /uploads para ser acessível via URL pública
  // O join vai buscar a pasta 'uploads' que está na raiz do seu projeto
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 4. Pipes de Validação Global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();