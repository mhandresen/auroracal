import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = (await NestFactory.create(ApiModule)).setGlobalPrefix('_api/v1');

  const config = new DocumentBuilder()
    .setTitle('Meeting Scheduler API')
    .setVersion('0.1.0')
    .build();

  app.enableCors({
    origin: ['http://localhost:5173', 'https://auroracal-web.vercel.app'],
    credentials: true,
  });
  app.use(cookieParser());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  const port = Number(process.env.PORT || 3000);
  await app.listen(port, '0.0.0.0');
  console.log('listening on', port);
}
void bootstrap();
