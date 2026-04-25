import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeaveRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LeaveRequestCreateInput) {
    return this.prisma.leaveRequest.create({ data });
  }

  async findAll() {
    return this.prisma.leaveRequest.findMany();
  }

  async findOne(id: string) {
    const record = await this.prisma.leaveRequest.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Leave Request not found');
    return record;
  }

  async update(id: string, data: Prisma.LeaveRequestUpdateInput) {
    await this.findOne(id);
    return this.prisma.leaveRequest.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.leaveRequest.delete({ where: { id } });
  }
}
