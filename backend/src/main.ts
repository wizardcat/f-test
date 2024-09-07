import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { mainConfig } from './config/main.config';
const { apiPrefix, apiPort } = mainConfig;
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix(apiPrefix);
  app.enableCors({
    origin: true,
    // origin: frontendURI,
    credentials: true,
  });
  app.use(helmet());
  // app.enableShutdownHooks();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // forbidNonWhitelisted: true,
      // whitelist: true,
    }),
  );
  // app.useWebSocketAdapter(new WsAdapter(app));

  const config = new DocumentBuilder()
    .setTitle('NestJS test app')
    .setDescription('The test app API description')
    .setVersion('1.0')
    .addTag('boilerplate')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(apiPort);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
