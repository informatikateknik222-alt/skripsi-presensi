import { Module } from '@nestjs/common';
import { PayrollRecordsController } from './payroll-records.controller';
import { PayrollRecordsService } from './payroll-records.service';

@Module({
  controllers: [PayrollRecordsController],
  providers: [PayrollRecordsService]
})
export class PayrollRecordsModule {}
