import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("Checking database...");
  try {
    const user = await prisma.user.findUnique({ where: { username: 'admin' } });
    console.log('User in DB:', user ? `Found (Role: ${user.role})` : 'NOT FOUND');
    
    if (user) {
      const isMatch = await bcrypt.compare('rahasia123', user.password);
      console.log('Password "rahasia123" matches hash in DB?:', isMatch);
    }

    const allUsers = await prisma.user.findMany();
    console.log('Total users in DB:', allUsers.length);
  } catch (e: any) {
    console.error("Error querying DB:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
