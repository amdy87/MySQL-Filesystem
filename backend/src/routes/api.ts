import express, { Request, Response } from 'express';
import { DbFile } from '../utils/file';
import { DbDirectory } from '../utils/directory';

export const apiRouter = express.Router();

apiRouter.get('/tree', (_req: Request, res: Response) => {
  const tmpFile: DbFile = {
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
