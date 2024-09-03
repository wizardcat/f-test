import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { mainConfig } from './config/main.config';

const { frontendURI, apiPrefix, apiPort } = mainConfig;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(apiPrefix);
  app.enableCors({
    origin: frontendURI,
    credentials: true,
  });
  app.enableShutdownHooks();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(apiPort);
}
bootstrap();
