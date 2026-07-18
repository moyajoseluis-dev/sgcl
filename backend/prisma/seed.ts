import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@sgcl.cl' },
    update: {},
    create: {
      email: 'admin@sgcl.cl',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'SGCL',
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuario admin creado: admin@sgcl.cl / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });