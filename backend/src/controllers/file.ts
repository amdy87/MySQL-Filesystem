import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

import { prisma } from '../entrypoint';
import { getAllPermissions } from './directory';
import { errorHandler } from '../utils/errorHandler';

export const fileController = {
  getFiles: async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        throw errorHandler.InvalidParamError('userId');
      }

      const files = await prisma.file.findMany({
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
          //   permissions: true,
        },
      });
      res.status(200).send({ ownerId: userId, files: files });
    } catch (error: any) {
      errorHandler.handleError(error, res);
    }
  },

  getFilesByParentDir: async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const parentDirId = parseInt(req.params.parentDirId);

      if (!(userId && parentDirId)) {
        throw errorHandler.InvalidParamError('userId and parentDirId');
      }

      const files = await prisma.file.findMany({
        where: {
          ownerId: userId,
          parentId: parentDirId,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          name: true,
          path: true,
          parentId: true,
          ownerId: true,
          //   permissions: true,
        },
      });
      res.status(200).send({ ownerId: userId, files: files });
    } catch (error: any) {
      if (error.code === 'P2025') {
        const message: string = 'A related User record could not be found.';
        error = errorHandler.UserNotFoundError(message);
      }
      errorHandler.handleError(error, res);
    }
  },

  addFile: async (req: Request, res: Response) => {
    let { ownerId, name, path, parentId, content } = req.body;
    content = content || '';
    try {
      if (!(ownerId && name && path && parentId)) {
        throw errorHandler.InvalidParamError(
          'ownerId, name, path, and parentId',
        );
      }

      const _existingUser = await prisma.user.findUnique({
        where: { id: ownerId },
      });

      // Default file has all 3 permissions
      const existingPermissions = await getAllPermissions();
      console.log(existingPermissions);
      // Prisma File record to be created in the database
      const fileData: Prisma.FileCreateInput = {
        parentId,
        ownerId,
        name,
        path,
        content,
        permissions: {
          connect: existingPermissions.map((permission) => ({
            id: permission.id,
          })),
        },
      };

      // prisma returns file object in json form if succeed
      const newFile = await prisma.file.create({
        data: fileData,
      });
      res.status(201).send(newFile);
    } catch (error: any) {
      // Error code of Prisma when record not found
      if (error.code === 'P2025') {
        const message: string = `User with id ${ownerId} does not exist`;
        error = errorHandler.UserNotFoundError(message);
      }
      errorHandler.handleError(error, res);
    }
  },

  // TODO: update

  // TODO: deleteByOwnerId
};
