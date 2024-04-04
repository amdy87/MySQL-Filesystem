/**
 * Routes for Tree API
 * @fileoverview
 */

import express, { Request, Response } from 'express';
import { DbFile } from '../utils/file';
import { DbDirectory } from '../utils/directory';
import { treeControllers } from '../controllers/tree';
import { authAccessToken } from '../middlewares/auth';

export const treeRouter = express.Router();

/**
 * Get a list of all directories owned by a user
 * @route GET /tree/treeByParent
 * @access authenticated User
 *
 * @body
 *  @requires
 *  @param {number} userId
 */
treeRouter.get(
  '/treeByParent',
  authAccessToken,
  treeControllers.getTreeByParentDirId,
);

treeRouter.get('/sampleData', (_req: Request, res: Response) => {
  const tmpFile: DbFile = {
    id: 4,
    name: 'myfile',
    metadata: {
      createdAt: 123,
      updatedAt: 555,
      perms: {
        read: true,
        write: false,
        execute: true,
      },
    },
  };
  const tmpFile2: DbFile = {
    id: 3,
    name: 'another file',
    metadata: {
      createdAt: 12344,
      updatedAt: 555555,
      perms: {
        read: true,
        write: false,
        execute: false,
      },
    },
  };
  const subDir: DbDirectory = {
    id: 2,
    name: 'root',
    metadata: {
      createdAt: 223,
      updatedAt: 655,
      perms: {
        read: false,
        write: false,
        execute: false,
      },
    },
    files: [],
    directories: [],
  };
  const dir: DbDirectory = {
    id: 1,
    name: 'root',
    metadata: {
      createdAt: 123,
      updatedAt: 455,
      perms: {
        read: true,
        write: true,
        execute: true,
      },
    },
    files: [tmpFile, tmpFile2],
    directories: [subDir],
  };
  res.send(dir);
});
