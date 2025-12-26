import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';

@Module({
  providers: [],
  controllers: [AppController],
  imports: [PrismaModule],
})
export class AppModule {}
