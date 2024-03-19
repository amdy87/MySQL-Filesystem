import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

import { prisma } from '../connectPrisma';
import { errorHandler } from '../utils/errorHandler';

// export const prismaPermissionsToPerms = (permissions: Prisma.Permission) => {

// };

export const permissionController = {
  getPermissions: async (req: Request, res: Response) => {
    try {
      const permissions = await prisma.permission.findMany();
      res.send({ permissions: permissions });
    } catch (error: any) {
      errorHandler.handleError(error, res);
    }
  },
};
