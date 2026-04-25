import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Post()
  create(@Body() createSalaryDto: Prisma.SalaryCreateInput) {
    return this.salaryService.create(createSalaryDto);
  }

  @Get()
  findAll() {
    return this.salaryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalaryDto: Prisma.SalaryUpdateInput) {
    return this.salaryService.update(id, updateSalaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salaryService.remove(id);
  }
}
