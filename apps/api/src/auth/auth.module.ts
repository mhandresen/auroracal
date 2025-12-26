import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [PrismaModule],
})
export class AuthModule {}
