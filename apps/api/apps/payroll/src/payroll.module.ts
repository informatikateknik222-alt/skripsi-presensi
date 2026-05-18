import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { PrismaModule } from './prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { SalaryModule } from './salary/salary.module';
import { PayrollRecordsModule } from './payroll-records/payroll-records.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    SalaryModule,
    PayrollRecordsModule,
  ],
  controllers: [PayrollController],
  providers: [
    PayrollService,
    JwtStrategy,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class PayrollModule {}
