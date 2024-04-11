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
import { getAllPermissions } from '../../src/controllers/directory';
import { errorHandler } from '../../src/utils/errorHandler';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create permissions
    const permissions = await prisma.permission.createMany({
      data: [
        { type: PermissionType.READ, userId: 0 },
        { type: PermissionType.WRITE, userId: 0 },
        { type: PermissionType.EXECUTE, userId: 0 },
      ],
    });

    console.log('Seed data created successfully');

    const password = '654321';
    const hashedPassword = bcrypt.hashSync(password, 12);
    const adminUser = {
      name: 'admin-0',
      email: 'zhang2752@wisc.edu',
      password: hashedPassword,
      role: Role.ADMIN,
    };
    const newAdminUser = await prisma.user.create({ data: adminUser });
    console.log(
      `Admin user: userId -> ${newAdminUser.id} created successfully`,
    );

    // Create a root dir for Admin user above,
    const existingPermissions = await getAllPermissions();
    const rootDirData = {
      name: 'root',
      path: '.',
      parentId: null,
      ownerId: newAdminUser.id,
      permissions: {
        connect: existingPermissions.map((permission) => ({
          id: permission.id,
        })),
      },
    };

    const rootDir = await prisma.directory.create({ data: rootDirData });

    // Update rootDir for user
    const updatedUser = await prisma.user.update({
      where: { id: newAdminUser.id },
      data: {
        rootDirId: rootDir.id,
      },
    });
    console.log(
      `Created root dir -> ${rootDir.id} for Admin user: userId -> ${newAdminUser.id}`,
    );
  } catch (error: any) {
    console.log(error);
  }
}

main()
  .catch((error) => {
    console.error('Error creating seed data:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
