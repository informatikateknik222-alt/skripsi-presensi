import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.EmployeeCreateInput) {
    return this.prisma.employee.create({ data });
  }

  async findAll() {
    return this.prisma.employee.findMany({
      include: {
        department: true,
        position: true,
      },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id_pegawai: id },
      include: {
        department: true,
        position: true,
      },
    });
    if (!employee) throw new NotFoundException(`Employee with ID ${id} not found`);
    return employee;
  }

  async update(id: string, data: Prisma.EmployeeUpdateInput) {
    await this.findOne(id); // Check existence
    return this.prisma.employee.update({
      where: { id_pegawai: id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence
    return this.prisma.employee.delete({ where: { id_pegawai: id } });
  }
}
