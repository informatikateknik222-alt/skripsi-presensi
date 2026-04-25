import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { SalaryModule } from './salary/salary.module';
import { PayrollRecordsModule } from './payroll-records/payroll-records.module';

@Module({
  imports: [PrismaModule, PassportModule, SalaryModule, PayrollRecordsModule],
  controllers: [AppController],
  providers: [
    AppService, 
    JwtStrategy,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
