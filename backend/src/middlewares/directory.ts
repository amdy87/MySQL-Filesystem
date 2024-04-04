/**
 * Middleware used in Directory API endpoints
 * @fileoverview
 */

import { Response, Request, NextFunction } from 'express';
import { Prisma, PermissionType } from '@prisma/client';
import { errorHandler } from '../utils/errorHandler';
import { prisma } from '../connectPrisma';

/**
 * This middleware is called if token is valid
 *  (after authenticated in middleware/auth.ts/authAccessToken)
 * Checks whether authenticated user has read permission of this directory
 * Used in cases:
 * 1) get directory by directoryId
 *
 * @param {Request} req
 *    @param {Object} req.authenticatedUser : {id: <useId>} - set by a successful token authentication
 *    @param {string} req.query.directoryId : id of a directory record
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @throw UnauthorizedError, status 401
 */
export const checkDirReadPerm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get permissions of this directory for this user
  try {
    let directoryId: number = -1;
    if (req.body?.directoryId) {
      directoryId = parseInt(req.body?.directoryId as string);
    } else if (req.query?.directoryId) {
      directoryId = parseInt(req.query?.directoryId as string);
    }
    const directory = await prisma.directory.findUnique({
      where: { id: directoryId },
      select: {
        permissions: true,
      },
    });
    let canRead = false;
    if (!directory) {
      throw errorHandler.RecordNotFoundError('directory does not exist');
    }
    directory?.permissions.map((p: any) => {
      if (p.type == PermissionType.READ) {
        canRead = true;
      }
    });
    if (!canRead) {
      throw errorHandler.UnauthorizedError(
        'User has no Read Permission on directory',
      );
    }
    next();
  } catch (error: any) {
    errorHandler.handleError(error, res);
  }
};

/**
 * This middleware is called if token is valid
 * (after authenticated in middleware/auth.ts/authAccessToken)
 * Checks whether authenticated user has write permission of this directory
 * Used in cases:
 * 1) update directory by directoryId
 * 2) delete directory by directoryId
 *
 * @param {Request} req
 * @param {Object} req.authenticatedUser : {id: <useId>} - set by a successful token authentication
 * @param {number} req.body.directoryId : id of a directory record
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @throw UnauthorizedError, status 401
 */
export const checkDirWritePerm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let directoryId: number = -1;
    if (req.body?.directoryId) {
      directoryId = parseInt(req.body?.directoryId as string);
    } else if (req.query?.directoryId) {
      directoryId = parseInt(req.query?.directoryId as string);
    }
    const directory = await prisma.directory.findUnique({
      where: { id: directoryId },
      select: {
        permissions: true,
      },
    });
    let canWrite = false;
    if (!directory) {
      throw errorHandler.RecordNotFoundError('directory does not exist');
    }
    directory?.permissions.map((p: any) => {
      if (p.type == PermissionType.WRITE) {
        canWrite = true;
      }
    });
    console.log(`canWrite: ${canWrite}`);
    if (!canWrite) {
      throw errorHandler.UnauthorizedError(
        'User has no WRITE Permission on directory',
      );
    }
    next();
  } catch (error: any) {
    errorHandler.handleError(error, res);
  }
};

/**
 * This middleware is called if token is valid
 * (after authenticated in middleware/auth.ts/authAccessToken)
 * Checks whether authenticated user has execute permission of this directory
 * Used in cases:
 * 1) ???
 *
 * @param {Request} req
 * @param {Object} req.authenticatedUser : {id: <useId>} - set by a successful token authentication
 * @param {string} req.body.directoryId : id of a directory record
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @throw UnauthorizedError, status 401
 */
export const checkDirExecutePerm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let directoryId: number = -1;
    if (req.body?.directoryId) {
      directoryId = parseInt(req.body?.directoryId as string);
    } else if (req.query?.directoryId) {
      directoryId = parseInt(req.query?.directoryId as string);
    }
    const directory = await prisma.directory.findUnique({
      where: { id: directoryId },
      select: {
        permissions: true,
      },
    });
    let canExecute = false;
    if (!directory) {
      throw errorHandler.RecordNotFoundError('directory does not exist');
    }
    directory?.permissions.map((p: any) => {
      if (p.type == PermissionType.EXECUTE) {
        canExecute = true;
      }
    });
    if (!canExecute) {
      throw errorHandler.UnauthorizedError(
        'User has no EXECUTE Permission on directory',
      );
    }
    next();
  } catch (error: any) {
    errorHandler.handleError(error, res);
  }
};
