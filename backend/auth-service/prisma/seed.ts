import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('rahasia123', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: hashedPassword },
    create: {
      username: 'admin',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { username: 'sdm' },
    update: { password: hashedPassword },
    create: {
      username: 'sdm',
      password: hashedPassword,
      role: Role.SDM,
    },
  });

  await prisma.user.upsert({
    where: { username: 'keuangan' },
    update: { password: hashedPassword },
    create: {
      username: 'keuangan',
      password: hashedPassword,
      role: Role.KEUANGAN,
    },
  });

  console.log('Users created: admin, sdm, keuangan (Password: rahasia123)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
