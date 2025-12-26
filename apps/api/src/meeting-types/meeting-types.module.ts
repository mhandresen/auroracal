import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MeetingTypesController } from './meeting-types.controller';
import { MeetingTypesService } from './meeting-types.service';

@Module({
  providers: [MeetingTypesService],
  controllers: [MeetingTypesController],
  imports: [PrismaModule],
  exports: [MeetingTypesService],
})
export class MeetingTypesModule {}
