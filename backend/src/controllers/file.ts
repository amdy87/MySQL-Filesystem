/**
 * Controllers for File API
 * @packageDocumentation
 */

import { Request, Response } from 'express';
import { $Enums, Prisma } from '@prisma/client';

import { prisma } from '../connectPrisma';
import { getAllPermissions } from './directory';
import { errorHandler } from '../utils/errorHandler';
import { DbFile } from '../utils/file';
import { Metadata, Perms } from '../utils/metadata';

/**
 * A Helper function
 * Update a file record in database
 * @param file
 * @param res
 * @returns updated File in json
 */
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

/**
 * Helper function
 * Check whether fileId exist
 * @param req
 * @param res
 *
 * @returns isExist : boolean
 */

const existFileId = async (fileId: number) => {
  const existingFile = await prisma.file.findUnique({
    where: { id: fileId },
  });
  return existingFile ? true : false;
};

/**
 * controllers
 */
export const fileControllers = {
  getFiles: async (req: Request, res: Response) => {
    try {
      if (!req.query?.userId) {
        throw errorHandler.InvalidParamError('userId');
      }

      const userId = parseInt(req.query.userId as string);
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
          permissions: true,
        },
      });
      res.status(200).send({ ownerId: userId, files: files });
    } catch (error: any) {
      errorHandler.handleError(error, res);
    }
  },

  getFilesByParentDir: async (req: Request, res: Response) => {
    try {
      if (!(req.query.userId && req.query.parentId)) {
        throw errorHandler.InvalidParamError('userId and parentId');
      }
      // const { userId } = req.body;
      const userId = parseInt(req.query.userId as string);
      const parentId = parseInt(req.query.parentId as string);

      const files = await prisma.file.findMany({
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
          'One of (ownerId, name, path, or parentId) ',
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: ownerId },
      });
      if (!existingUser) {
        throw errorHandler.UserNotFoundError('User does not exist');
      }

      // Default file has all 3 permissions
      const existingPermissions = await getAllPermissions();
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
      console.log(error);
      // Error code of Prisma when record not found
      if (error.code === 'P2025') {
        const message: string = `User with id ${ownerId} does not exist`;
        error = errorHandler.UserNotFoundError(message);
      }
      errorHandler.handleError(error, res);
    }
  },

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
      console.log(error);
      errorHandler.handleError(error, res);
    }
  },

  deleteFileById: async (req: Request, res: Response) => {
    try {
      if (!req.params?.fileId) {
        throw errorHandler.InvalidParamError('fileId');
      }
      const fileId = parseInt(req.params.fileId as string);
      const fileExist = await existFileId(fileId);
      if (fileExist) {
        const deletedFile = await prisma.file.delete({
          where: {
            id: fileId,
          },
          select: {
            id: true,
            name: true,
          },
        });
        res.status(200).send({
          message: `file ${fileId} has been deleted`,
          file: deletedFile,
        });
      } else {
        throw errorHandler.RecordNotFoundError(`${fileId} is not a valid id`);
      }
    } catch (error: any) {
      console.log(`${error}`);
      errorHandler.handleError(error, res);
    }
  },
};
