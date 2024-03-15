/**
 * This file inserts initial database records when the
 * File system is first initialized.
 *
 * 1. 3 unique Permission Records
 * 2. 1 Admin User (by default, this user will have userId 1)
 *
 * @packageDocumentation
 */

import { Prisma, PrismaClient, PermissionType, Role } from '@prisma/client';

import bcrypt from 'bcrypt';

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

  let user: Prisma.UserCreateInput;
  const password = '654321';
  const hashedPassword = bcrypt.hashSync(password, 12);
  const adminUser = {
    name: 'admin-0',
    email: 'zhang2752@wisc.edu',
    password: hashedPassword,
    role: Role.ADMIN,
  };
  const newAdminUser = await prisma.user.create({ data: adminUser });
  console.log(`Admin user: userId -> ${newAdminUser.id} created successfully`);
}

main()
  .catch((error) => {
    console.error('Error creating seed data:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
