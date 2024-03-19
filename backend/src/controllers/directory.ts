import { Request, Response } from 'express';
import { Prisma, PermissionType } from '@prisma/client';

import { prisma } from '../connectPrisma';
import { errorHandler } from '../utils/errorHandler';

export const getAllPermissions = async () => {
  const existingPermissions = await prisma.permission.findMany({
    where: {
      type: {
        in: [PermissionType.READ, PermissionType.WRITE, PermissionType.EXECUTE],
      },
    },
  });
  return existingPermissions;
};

export const directoryController = {
  getDirectories: async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        throw errorHandler.InvalidParamError('userId');
      }

      const directories = await prisma.directory.findMany({
        where: {
          ownerId: userId,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          name: true,
          path: true,
          parentId: true,
          ownerId: true,
          permissions: true,
        },
      });
      res.status(200).send({ ownerId: userId, dirs: directories });
    } catch (error: any) {
      errorHandler.handleError(error, res);
    }
  },

  addRootDirectory: async (req: Request, res: Response) => {
    try {
      var { ownerId, name, path } = req.body;
      if (!ownerId) {
        throw errorHandler.InvalidParamError('ownerId');
      }

      // Check if user exists, TODO: move to middleware later
      const existingUser = await prisma.user.findUnique({
        where: { id: ownerId },
      });

      // TODO: Check uniqueness of root dir

      if (!existingUser) {
        throw errorHandler.UserNotFoundError('User does not exist');
      }
      // Retrieve existing permission records from the database
      const existingPermissions = await getAllPermissions();

      let directory: Prisma.DirectoryCreateInput;
      directory = {
        name: name,
        parentId: null,
        path: path,
        ownerId: ownerId,
        permissions: {
          connect: existingPermissions.map((permission) => ({
            id: permission.id,
          })),
        },
      };
      const result = await prisma.directory.create({ data: directory });
      return result;
    } catch (error: any) {
      if (error.code === 'P2002') {
        // TODO: Check with DB, does DB handle this correctly
        const message = 'Directory with the same name already exists.';
        error = errorHandler.DuplicationError(message);
      }
      errorHandler.handleError(error, res);
    }
  },
  addDirectory: async (req: Request, res: Response) => {
    try {
      var { ownerId, parentId, name, path } = req.body;
      if (!ownerId) {
        throw errorHandler.InvalidParamError('ownerId');
      }

      // Check if user exists
      // TODO: replace with auth middleware later
      const existingUser = await prisma.user.findUnique({
        where: { id: ownerId },
      });

      if (!existingUser) {
        throw errorHandler.UserNotFoundError('User does not exist');
      }

      if (!parentId) {
        throw errorHandler.InvalidParamError('parentId');
      }

      // Retrieve existing permission records from the database
      const existingPermissions = await getAllPermissions();

      let directory: Prisma.DirectoryCreateInput;
      directory = {
        name: name,
        parentId: parentId,
        path: path,
        ownerId: ownerId,
        permissions: {
          connect: existingPermissions.map((permission) => ({
            id: permission.id,
          })),
        },
      };
      const newDirectory = await prisma.directory.create({ data: directory });
      res.status(201).send({
        dir: newDirectory,
        message: 'Successfully create a directory',
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        // TODO: Check with DB, does DB handle this correctly
        const message = 'Directory with the same name already exists.';
        error = errorHandler.DuplicationError(message);
      }
      errorHandler.handleError(error, res);
    }
  },

  // TODO: update

  // TODO: deleteByOwnerId
};
