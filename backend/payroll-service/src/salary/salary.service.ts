import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalaryService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SalaryCreateInput) {
    return this.prisma.salary.create({ data });
  }

  async findAll() {
    return this.prisma.salary.findMany();
  }

  async findOne(id: string) {
    const record = await this.prisma.salary.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Salary data not found');
    return record;
  }

  async update(id: string, data: Prisma.SalaryUpdateInput) {
    await this.findOne(id);
    return this.prisma.salary.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.salary.delete({ where: { id } });
  }
}
