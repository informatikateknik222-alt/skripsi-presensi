import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed, but service will continue to start:", error.message);
    }
  }
}
