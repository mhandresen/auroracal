import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = (await NestFactory.create(ApiModule)).setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Meeting Scheduler API')
    .setVersion('0.1.0')
    .build();

  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });
  app.use(cookieParser());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
