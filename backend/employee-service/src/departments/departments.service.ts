import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.DepartmentCreateInput) {
    return this.prisma.department.create({ data });
  }

  async findAll() {
    return this.prisma.department.findMany();
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({ where: { id } });
    if (!department) throw new NotFoundException(`Department with ID ${id} not found`);
    return department;
  }

  async update(id: string, data: Prisma.DepartmentUpdateInput) {
    await this.findOne(id); // Check existence
    return this.prisma.department.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence
    return this.prisma.department.delete({ where: { id } });
  }
}
