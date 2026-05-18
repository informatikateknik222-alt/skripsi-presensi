import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log("Payroll Database connected successfully");
    } catch (error) {
      console.error("Payroll Database connection failed:", error.message);
    }
  }
}
