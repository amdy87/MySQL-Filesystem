/**
 * Controllers used in Directory API
 * @pakageDocumentation
 */

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

export const directoryControllers = {
  getDirectories: async (req: Request, res: Response) => {
    try {
      if (!req.query?.userId) {
        throw errorHandler.InvalidQueryParamError('userId');
      }
      const userId = parseInt(req.query.userId as string);

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

  getDirsByParentDir: async (req: Request, res: Response) => {
    try {
      if (!(req.query?.userId && req.query?.parentId)) {
        throw errorHandler.InvalidQueryParamError('userId or/and parentId');
      }
      const userId = parseInt(req.query.userId as string);
      const parentId = parseInt(req.query.parentId as string);

      const directories = await getDirsByParent(userId, parentId);
      res.status(200).send({ ownerId: userId, dirs: directories });
    } catch (error: any) {
      errorHandler.handleError(error, res);
    }
  },

  addRootDirectory: async (req: Request, res: Response) => {
    try {
      var { ownerId, name, path } = req.body;
      if (!ownerId) {
        throw errorHandler.InvalidBodyParamError('ownerId');
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
        throw errorHandler.InvalidBodyParamError('ownerId');
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
        throw errorHandler.InvalidBodyParamError('parentId');
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

export const getDirsByParent = async (userId: number, parentId: number) => {
  const directories = await prisma.directory.findMany({
    where: {
      ownerId: userId,
      parentId: parentId,
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
  return directories;
};

export const getDirById = async (dirId: number) => {
  const dir = await prisma.directory.findUnique({
    where: {
      id: dirId,
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
  return dir;
};
