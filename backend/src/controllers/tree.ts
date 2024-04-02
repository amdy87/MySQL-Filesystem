/**
 * Controllers used in API to return files and directorys
 * under a parent directory owned by a user
 * @pakageDocumentation
 */

import { Request, Response } from 'express';
import { Prisma, PermissionType } from '@prisma/client';

import { DbFile } from '../utils/file';
import { DbDirectory } from '../utils/directory';
import { TreeNode } from '../utils/tree';

import { prisma } from '../connectPrisma';
import { errorHandler } from '../utils/errorHandler';
import { getFilesByParent } from './file';
import { getDirsByParent, getDirById } from './directory';

export const treeControllers = {
  getTreeByParentDirId: async (req: Request, res: Response) => {
    try {
      if (!(req.query.userId && req.query.parentId)) {
        throw errorHandler.InvalidParamError('userId or/and parentId');
      }
      // Get userId and parentDirId from query
      const userId = parseInt(req.query.userId as string);
      const parentId = parseInt(req.query.parentId as string);

      //   TODO: get children dirs recursively
      const tree = await getDocsByParent(userId, parentId);
      res.status(200).send(tree);
    } catch (error: any) {
      errorHandler.handleError(error, res);
    }
  },
};

// const recursiveGetFiles

/** Convert the list of permissions stored in a Prisma File object
 * to the perms format that frontend can handle
 */
const prismaPermissionsToPerms = (permissions: any) => {};

/**
 *
 * Recursively construct the tree structure for files and dirs
 */
const getDocsByParent = async (userId: number, parentId: number) => {
  const dirs = await getDirsByParent(userId, parentId);
  const files = await getFilesByParent(userId, parentId);
  const dbFiles: DbFile[] = files.map((file) => ({
    id: file.id,
    name: file.name,
    metadata: {
      createdAt: new Date(file.createdAt || '').getTime(),
      updatedAt: new Date(file.updatedAt || '').getTime(),
      perms: {
        read: true,
        write: true,
        execute: true,
      },
    },
  }));

  const currDir = await getDirById(parentId);

  const result: DbDirectory = {
    id: parentId,
    ownerId: userId,
    name: currDir?.name || 'Dir has no name',
    files: dbFiles,
    directories: [],
    metadata: {
      createdAt: new Date(currDir?.createdAt || '').getTime(),
      updatedAt: new Date(currDir?.updatedAt || '').getTime(),
      perms: {
        read: true,
        write: true,
        execute: true,
      },
    },
  };

  if (dirs.length == 0) {
    return result;
  }

  // Recursively call getDocsByParent for each directory
  const subResult = await Promise.all(
    dirs.map(async (dir) => {
      return await getDocsByParent(userId, dir.id);
    }),
  );
  result.directories = subResult;
  return result;
};
