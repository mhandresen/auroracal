import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { EmailModule } from '../infra/email/email.module';
import { TenantResolver } from '../tenant/tenant-resolver';
import { PublicController } from './public.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [PublicService, TenantResolver],
  controllers: [PublicController],
  imports: [EmailModule, PrismaModule],
})
export class PublicModule {}
