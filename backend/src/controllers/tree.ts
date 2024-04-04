/**
 * Controllers used in API to return files and directorys
 * under a parent directory owned by a user
 * @fileoverview
 */

import { Request, Response } from 'express';
import { Prisma, PermissionType } from '@prisma/client';

import { DbFile } from '../utils/file';
import { DbDirectory } from '../utils/directory';

import { errorHandler } from '../utils/errorHandler';
import { getFilesByParent } from './file';
import { getDirsByParent, getDirById } from './directory';

export const treeControllers = {
  getTreeByParentDirId: async (req: Request, res: Response) => {
    try {
      if (!(req.query.userId && req.query.parentId)) {
        throw errorHandler.InvalidQueryParamError('userId or/and parentId');
      }

      // Get userId and parentDirId from query
      const userId = parseInt(req.query.userId as string);
      const parentId = parseInt(req.query.parentId as string);

      if (req.authenticatedUser?.id != userId) {
        throw errorHandler.UnauthorizedError(
          'Token does not matched with user',
        );
      }

      const currDir = await getDirById(parentId);

      if (!currDir) {
        throw errorHandler.RecordNotFoundError(
          `parentDirId ${parentId} does not exist`,
        );
      }

      if (currDir.ownerId != userId) {
        throw errorHandler.UnauthorizedError(
          'User does not own this directory',
        );
      }

      // get all dirs  and files recursively
      const tree = await getDocsByParent(userId, parentId);
      res.status(200).send(tree);
    } catch (error: any) {
      errorHandler.handleError(error, res);
    }
  },
};

/** Convert the list of permissions stored in a Prisma File object
 * to the perms format that frontend can handle
 */
export const prismaPermissionsToPerms = (permissions: any) => {
  let perms = {
    read: false,
    write: false,
    execute: false,
  };
  permissions.map((p: any) => {
    if (p.type == PermissionType.READ) {
      perms.read = true;
    } else if (p.type == PermissionType.WRITE) {
      perms.write = true;
    } else if (p.type == PermissionType.EXECUTE) {
      perms.execute = true;
    }
  });
  return perms;
};

/**
 *
 * Get files and dirs stored in parentId
 *
 * @param {number} userId
 * @param {number} parentId
 *
 * @return {DbDirectory} dbDir
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
      perms: prismaPermissionsToPerms(file.permissions),
    },
  }));
  const dbDirs: DbDirectory[] = dirs.map((dir) => ({
    id: dir.id,
    name: dir.name,
    metadata: {
      createdAt: new Date(dir.createdAt || '').getTime(),
      updatedAt: new Date(dir.updatedAt || '').getTime(),
      perms: prismaPermissionsToPerms(dir.permissions),
    },
  }));
  const currDir = await getDirById(parentId);

  const result: DbDirectory = {
    id: parentId,
    ownerId: userId,
    name: currDir?.name || 'Dir has no name',
    files: dbFiles,
    directories: dbDirs,
    metadata: {
      createdAt: new Date(currDir?.createdAt || '').getTime(),
      updatedAt: new Date(currDir?.updatedAt || '').getTime(),
      perms: prismaPermissionsToPerms(currDir?.permissions),
    },
  };

  return result;
};

/**
 *
 * Recursively construct the tree structure for files and dirs
 */
const getAllDocsByParent = async (userId: number, parentId: number) => {
  const dirs = await getDirsByParent(userId, parentId);
  const files = await getFilesByParent(userId, parentId);
  const dbFiles: DbFile[] = files.map((file) => ({
    id: file.id,
    name: file.name,
    metadata: {
      createdAt: new Date(file.createdAt || '').getTime(),
      updatedAt: new Date(file.updatedAt || '').getTime(),
      perms: prismaPermissionsToPerms(file.permissions),
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
      perms: prismaPermissionsToPerms(currDir?.permissions),
    },
  };

  if (dirs.length == 0) {
    return result;
  }

  // Recursively call getDocsByParent for each directory
  const subResult = await Promise.all(
    dirs.map(async (dir) => {
      return await getAllDocsByParent(userId, dir.id);
    }),
  );
  result.directories = subResult;
  return result;
};
