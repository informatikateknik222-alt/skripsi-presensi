import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PayrollRecordsService } from './payroll-records.service';
import { Prisma } from '../../prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('payroll-records')
export class PayrollRecordsController {
  constructor(private readonly payrollRecordsService: PayrollRecordsService) {}

  @Post()
  create(@Body() createPayrollRecordDto: Prisma.PayrollRecordCreateInput) {
    return this.payrollRecordsService.create(createPayrollRecordDto);
  }

  @Get()
  findAll() {
    return this.payrollRecordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payrollRecordsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayrollRecordDto: Prisma.PayrollRecordUpdateInput) {
    return this.payrollRecordsService.update(id, updatePayrollRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payrollRecordsService.remove(id);
  }
}
