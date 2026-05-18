import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { FingerspotSyncService } from './fingerspot-sync.service';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, FingerspotSyncService]
})
export class AttendanceModule {}
