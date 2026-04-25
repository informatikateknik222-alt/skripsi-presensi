import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveRequestsModule } from './leave-requests/leave-requests.module';

@Module({
  imports: [PrismaModule, PassportModule, AttendanceModule, LeaveRequestsModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
