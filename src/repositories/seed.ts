import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'brenno@teste.com' },
    update: {},
    create: {
      name: 'Brenno',
      email: 'brenno@teste.com',
    },
  });

  console.log('Seed executado com sucesso:', user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
