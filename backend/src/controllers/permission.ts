/**
 * Controllers used in Permission API
 * @fileoverview
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

import { prisma } from '../connectPrisma';
import { errorHandler } from '../utils/errorHandler';

// export const prismaPermissionsToPerms = (permissions: Prisma.Permission) => {

// };

export const getPermissionsByFileId = async (fileId: number) => {
  const permissions = await prisma.permission.findMany({
    where: { fileId: fileId },
  });
  return permissions;
};

export const getPermissionsByDirectoryId = async (directoryId: number) => {
  const permissions = await prisma.permission.findMany({
    where: { directoryId: directoryId },
  });
  return permissions;
};

export const permissionControllers = {
  getPermissions: async (req: Request, res: Response) => {
    try {
      const permissions = await prisma.permission.findMany();
      res.send({ permissions: permissions });
    } catch (error: any) {
      errorHandler.handleError(error, res);
    }
  },
};
