import { PrismaClient, PermissionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Create permissions
  const permissions = await prisma.permission.createMany({
    data: [
      { type: PermissionType.READ },
      { type: PermissionType.WRITE },
      { type: PermissionType.EXECUTE },
    ],
  });


  console.log('Seed data created successfully');
}

main()
  .catch(error => {
    console.error('Error creating seed data:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
