import { PrismaClient, Role, PermissionType } from '@prisma/client';

export const userData: any[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    password: 'abcdefg',
    role: Role.ADMIN,
    id: 0,
  },
];

export const directoryData: any[] = [
  {
    name: 'directory',
    path: '/directory',
    parentId: 0,
    ownerId: 1,
    permissions: [
      PermissionType.READ,
      PermissionType.WRITE,
      PermissionType.EXECUTE,
    ],
    id: 0,
  },
];

export const fileData: any[] = [
  {
    name: 'file',
    path: '/directory4/file',
    parentId: 1,
    ownerId: 1,
    content: 'file content',
    permissions: [
      PermissionType.READ,
      PermissionType.WRITE,
      PermissionType.EXECUTE,
    ],
    id: 0,
  },
];
