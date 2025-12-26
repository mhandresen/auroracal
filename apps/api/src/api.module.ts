import { Module } from '@nestjs/common';
import { PublicModule } from './public/public.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailService } from './infra/email/email.service';
import { EmailModule } from './infra/email/email.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { AppModule } from './app/app.module';
import { MeetingTypesModule } from './meeting-types/meeting-types.module';
import { AvailabilityModule } from './availability/availability.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 120,
      },
    ]),
    PublicModule,
    PrismaModule,
    EmailModule,
    AuthModule,
    AppModule,
    MeetingTypesModule,
    AvailabilityModule,
  ],
  controllers: [],
  providers: [EmailService, { provide: 'APP_GUARD', useClass: ThrottlerGuard }],
})
export class ApiModule {}
