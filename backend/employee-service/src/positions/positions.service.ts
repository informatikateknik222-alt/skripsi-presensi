import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PositionCreateInput) {
    return this.prisma.position.create({ data });
  }

  async findAll() {
    return this.prisma.position.findMany();
  }

  async findOne(id: string) {
    const position = await this.prisma.position.findUnique({ where: { id } });
    if (!position) throw new NotFoundException(`Position with ID ${id} not found`);
    return position;
  }

  async update(id: string, data: Prisma.PositionUpdateInput) {
    await this.findOne(id); // Check existence
    return this.prisma.position.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check existence
    return this.prisma.position.delete({ where: { id } });
  }
}
