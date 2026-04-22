import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findFirst({
    where: { role: 'superadmin' },
  });

  if (existing) {
    console.log('Superadmin already exists, skipping seed');
    return;
  }

  await prisma.user.create({
    data: {
      clerk_id: 'user_3CA2IporskT2jekRZ5Ma7sT4vzF',
      full_name: 'jane123',
      username: 'jane123',
      role: 'superadmin',
      is_active: true,
    },
  });

  console.log('Superadmin created');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
