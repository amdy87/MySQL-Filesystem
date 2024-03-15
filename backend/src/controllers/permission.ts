import { Request, Response } from 'express';
import { prisma } from '../entrypoint';
import { errorHandler } from '../utils/errorHandler';

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
