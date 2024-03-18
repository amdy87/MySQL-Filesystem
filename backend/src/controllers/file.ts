import { Request, Response } from 'express';
import { $Enums, Prisma } from '@prisma/client';

import { prisma } from '../entrypoint';
import { getAllPermissions } from './directory';
import { errorHandler } from '../utils/errorHandler';
import { DbFile } from '../utils/file';
import { Metadata, Perms } from '../utils/metadata';

const updateFile = async (file: DbFile, res: Response) => {
  try {
    const updatedFile = await prisma.file.update({
      where: { id: file.id },
      data: {
        ownerId: file.ownerId,
        name: file.name,
        parentId: file.parentId,
        content: file.content,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        path: true,
        parentId: true,
        ownerId: true,
        content: true,
        permissions: true,
      },
    });
    return updatedFile;
  } catch (error: any) {
    errorHandler.handleError(error, res);
  }
};

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
          content: true,
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
  updateFileById: async (req: Request, res: Response) => {
    try {
      //  Doesn't support change permission yet
      const { fileId, name, content, path, ownerId, permissions, parentId } =
        req.body;

      let file: Prisma.FileFindUniqueArgs;
      if (!fileId) {
        throw errorHandler.InvalidParamError('fileId');
      }
      file = { where: { id: fileId } };

      const existFile = await prisma.file.findUnique(file);

      if (!existFile) {
        throw errorHandler.RecordNotFoundError('File does not exist');
      }
      let perms: Perms = { read: true, write: true, execute: true };
      let metadata: Metadata = {
        // TODO: perms: existFile.permissions,
        perms: perms,
        createdAt: existFile.createdAt.getTime(),
        updatedAt: Date.now(),
      };
      // Update file record in the database
      const updatedFile = await updateFile(
        {
          id: fileId,
          name: name || existFile.name, // Update name if provided, otherwise keep existing value
          parentId: parentId || existFile.parentId,
          content: content || existFile.content,
          ownerId: ownerId || existFile.ownerId,
          metadata: metadata,
        },
        res,
      );
      res.status(200).send({ file: updatedFile });
    } catch (error: any) {
      errorHandler.handleError(error, res);
    }
  },

  // TODO: deleteByOwnerId
};
