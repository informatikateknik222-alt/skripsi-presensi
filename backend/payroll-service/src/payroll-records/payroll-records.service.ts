import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PayrollRecordsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PayrollRecordCreateInput) {
    return this.prisma.payrollRecord.create({ data });
  }

  async findAll() {
    return this.prisma.payrollRecord.findMany();
  }

  async findOne(id: string) {
    const record = await this.prisma.payrollRecord.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Payroll Record not found');
    return record;
  }

  async update(id: string, data: Prisma.PayrollRecordUpdateInput) {
    await this.findOne(id);
    return this.prisma.payrollRecord.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.payrollRecord.delete({ where: { id } });
  }
}
