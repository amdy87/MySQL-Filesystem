/**
 * Define Controllers used in Directory API
 *  directoryControllers.getDirectories
 *  directoryControllers.getDirsByParentDir
 *  directoryControllers.addRootDirectory
 *  directoryControllers.addDirectory
 *  directoryControllers.deleteDirectory
 *
 * Functions:
 *  getAllPermissions
 *  deleteFilesOwnedByUserId
 *
 * @@fileoverview
 */

import { Request, Response } from 'express';
import { Prisma, PermissionType } from '@prisma/client';

import { prisma } from '../connectPrisma';
import { errorHandler } from '../utils/errorHandler';
import { Metadata, Perms } from '../utils/metadata';
import { DbDirectory } from '../utils/directory';

/**
 * A Helper function
 * @returns all Permission records
 */
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

/**
 * Helper function
 *
 * delete Dirs owned by userId
 * @param userId
 *
 * @returns number of file deleted
 */
export const deleteDirsByOwner = async (userId: number, res: Response) => {
  try {
    const deletedDirs = await prisma.directory.deleteMany({
      where: {
        ownerId: userId,
      },
    });
    return deletedDirs.count;
  } catch (error: any) {
    errorHandler.handleError(error, res);
  }
};

/* Check whether directoryId exist
 * @param req
 * @param res
 *
 * @returns isExist : boolean
 */

const existDirectoryId = async (directoryId: number) => {
  const existingDirectory = await prisma.directory.findUnique({
    where: { id: directoryId },
  });
  console.log(existingDirectory, 'THIS');
  return existingDirectory ? true : false;
};

/**
 * Helper function
 * Check if there are child files in parent directory
 * @param req
 * @param res
 *
 * @returns isExist : boolean
 */

const getFilesByParentDir = async (directoryId: number) => {
  const existingFiles = await prisma.file.findMany({
    where: { parentId: directoryId },
  });
  return existingFiles ? true : false;
};

/**
 * A Helper function
 * Update a Directory record in database
 * @param {DbDirectory} dir
 * @param {Response} res
 * @returns updated Directory in json
 */
const updateDirectory = async (dir: DbDirectory, res: Response) => {
  try {
    const updatedDirectory = await prisma.directory.update({
      where: { id: dir.id },
      data: {
        ownerId: dir.ownerId,
        name: dir.name,
        parentId: dir.parentId,
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
    return updatedDirectory;
  } catch (error: any) {
    errorHandler.handleError(error, res);
  }
};

export const directoryControllers = {
  getDirectory: async (req: Request, res: Response) => {
    try {
      if (!req.query?.directoryId) {
        throw errorHandler.InvalidQueryParamError('directoryId');
      }
      const directoryId = parseInt(req.query.directoryId as string);

      const directory = await prisma.directory.findUnique({
        where: {
          id: directoryId,
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
      res.status(200).send({ dir: directory });
    } catch (error: any) {
      errorHandler.handleError(error, res);
    }
  },
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
      var { ownerId, name} = req.body;
      if (!ownerId) {
        throw errorHandler.InvalidBodyParamError('ownerId');
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: ownerId },
      });

      if (!existingUser) {
        throw errorHandler.UserNotFoundError('User does not exist');
      }
      // Retrieve existing permission records from the database
      const directory = {
        name: name,
        parentId: null,
        ownerId: ownerId,
        path: ".",
        permissions: {
          createMany: {
            data: [
              {
                type: PermissionType.READ,
                userId: ownerId,
                enabled: true,
              }, // Replace with the ID of the user
              {
                type: PermissionType.WRITE,
                userId: ownerId,
                enabled: true,
              }, // Replace with the ID of the user
              {
                type: PermissionType.EXECUTE,
                userId: ownerId,
                enabled: true,
              }, // Replace with the ID of the user
            ],
          },
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
      var { ownerId, parentId, name} = req.body;
      if (!(ownerId && parentId && name)) {
        throw errorHandler.InvalidBodyParamError(
          'One of (ownerId , parentId , name)',
        );
      }

      // Check if user exists
      // TODO: replace with auth middleware later
      const existingUser = await prisma.user.findUnique({
        where: { id: ownerId },
      });

      const parentDirectory = await prisma.directory.findUnique({
        where: {id: parentId},
        select:{
          path: true
        }
      });

      if (!existingUser) {
        throw errorHandler.UserNotFoundError('User does not exist');
      }

      if (!parentId) {
        throw errorHandler.InvalidBodyParamError('parentId');
      }

      // Retrieve existing permission records from the database
      const existingPermissions = await getAllPermissions();

      const directory = {
        name: name,
        parentId: parentId,
        ownerId: ownerId,
        path: parentDirectory?.path + "/" + name,
        permissions: {
          createMany: {
            data: [
              {
                type: PermissionType.READ,
                userId: ownerId,
                enabled: true,
              }, // Replace with the ID of the user
              {
                type: PermissionType.WRITE,
                userId: ownerId,
                enabled: true,
              }, // Replace with the ID of the user
              {
                type: PermissionType.EXECUTE,
                userId: ownerId,
                enabled: true,
              }, // Replace with the ID of the user
            ],
          },
        },
      };
      const newDirectory = await prisma.directory.create({ data: directory });
      res.status(201).send({
        dir: newDirectory,
        message: 'Successfully create a directory',
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const message = 'Directory with the same name already exists.';
        error = errorHandler.DuplicationError(message);
      }
      errorHandler.handleError(error, res);
    }
  },

  updateDirById: async (req: Request, res: Response) => {
    try {
      //  Doesn't support change permission yet
      const { directoryId, name, permissions, parentId } = req.body;

      let dir: Prisma.DirectoryFindUniqueArgs;
      if (!directoryId) {
        throw errorHandler.InvalidBodyParamError('directoryId');
      }
      dir = { where: { id: directoryId } };

      const existDirectory = await prisma.directory.findUnique(dir);
      if (!existDirectory) {
        throw errorHandler.RecordNotFoundError('Directory does not exist');
      }
      let perms: Perms = { read: true, write: true, execute: true };
      let metadata: Metadata = {
        // TODO: perms: existDirectory.permissions,
        perms: perms,
        createdAt: existDirectory.createdAt.getTime(),
        updatedAt: Date.now(),
      };
      // Update file record in the database
      const updatedDirectory = await updateDirectory(
        {
          id: directoryId,
          name: name || existDirectory.name, // Update name if provided, otherwise keep existing value
          parentId: parentId || existDirectory.parentId,
          metadata: metadata,
        },
        res,
      );
      res.status(200).send({ directory: updatedDirectory });
    } catch (error: any) {
      console.log(error);
      errorHandler.handleError(error, res);
    }
  },

  deleteDirectoryById: async (req: Request, res: Response) => {
    try {
      if (!req.body?.directoryId) {
        console.log('no directory id in body');
        throw errorHandler.InvalidBodyParamError('directoryId');
      }
      const directoryId = parseInt(req.body.directoryId as string);
      const directoryExist = await existDirectoryId(directoryId);
      console.log(directoryExist);
      console.log(directoryId);

      if (directoryExist) {
        // check if there are files with parentId that match the directoryId
        const fileIds = await getFilesByParentDir(directoryId);
        let deletedFiles;
        if (fileIds) {
          // delete all files that have the parentId of the current directoryId
          deletedFiles = await prisma.file.deleteMany({
            where: {
              parentId: directoryId,
            },
          });
        }
        // delete all the subdirectories within in the current directory
        const deletedsubDirectories = await prisma.directory.deleteMany({
          where: {
            parentId: directoryId
          }
        });

        // delete the directory
        const deletedDirectory = await prisma.directory.delete({
          where: {
            id: directoryId,
          },
        });
        res.status(200).send({
          message: `directory with id ${directoryId} and all files in that directory have been deleted`,
          directory: deletedDirectory,
          file: deletedFiles,
        });
      } else {
        console.log('no valid directoryid');
        throw errorHandler.RecordNotFoundError(
          `${directoryId} is not a valid directory id`,
        );
      }
    } catch (error: any) {
      console.log(`some other error here: ${error}`);
      errorHandler.handleError(error, res);
    }
  },
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
