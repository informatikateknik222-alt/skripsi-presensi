import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { PrismaModule } from './prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { AttendanceModule as CoreAttendanceModule } from './attendance/attendance.module';
import { LeaveRequestsModule } from './leave-requests/leave-requests.module';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    ScheduleModule.forRoot(),
    CoreAttendanceModule,
    LeaveRequestsModule,
  ],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    JwtStrategy,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AttendanceModule {}
