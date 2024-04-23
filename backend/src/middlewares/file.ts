/**
 * Middleware used in File API endpoints
 * @fileoverview
 */

import { Response, Request, NextFunction } from 'express';
import { Prisma, PermissionType, Role } from '@prisma/client';
import { errorHandler } from '../utils/errorHandler';
import { prisma } from '../connectPrisma';

/**
 * This middleware is called if token is valid
 *  (after authenticated in middleware/auth.ts/authAccessToken)
 * Checks whether authenticated user has read permission of this file
 * Used in cases:
 * 1) get file content by fileId
 *
 * @param {Request} req
 *    @param {Object} req.authenticatedUser : {id: <useId>} - set by a successful token authentication
 *    @param {string} req.query.fileId : id of a file record
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @throw UnauthorizedError, status 401
 */
export const checkFileReadPerm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get permissions of this file for this user
  try {
    let fileId: number = -1;
    if (req.body?.fileId) {
      fileId = parseInt(req.body?.fileId as string);
    } else if (req.query?.fileId) {
      fileId = parseInt(req.query?.fileId as string);
    }
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      select: {
        permissions: true,
      },
    });
    let canRead = false;
    if (!file) {
      throw errorHandler.RecordNotFoundError('File does not exist');
    }
    file?.permissions.map((p: any) => {
      if (p.type == PermissionType.READ && Boolean(p.enabled) == true) {
        canRead = true;
      }
    });
    if (!canRead) {
      throw errorHandler.UnauthorizedError(
        'User has no Read Permission on file',
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
 * Checks whether authenticated user has write permission of this file
 * Used in cases:
 * 1) update file by fileId
 * 2) delete file by fileId
 *
 * @param {Request} req
 * @param {Object} req.authenticatedUser : {id: <useId>} - set by a successful token authentication
 * @param {number} req.body.fileId : id of a file record
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @throw UnauthorizedError, status 401
 */
export const checkFileWritePerm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let fileId: number = -1;
    if (req.body?.fileId) {
      fileId = parseInt(req.body?.fileId as string);
    } else if (req.query?.fileId) {
      fileId = parseInt(req.query?.fileId as string);
    }
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      select: {
        permissions: true,
      },
    });
    let canWrite = false;
    if (!file) {
      throw errorHandler.RecordNotFoundError('File does not exist');
    }
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.authenticatedUser.id) },
      select: {
        role: true,
      },
    });

    file?.permissions.map((p: any) => {
      if (
        (p.type == PermissionType.WRITE && Boolean(p.enabled) == true) ||
        user?.role == Role.ADMIN
      ) {
        canWrite = true;
      }
    });
    console.log(`canWrite: ${canWrite}`);
    if (!canWrite) {
      throw errorHandler.UnauthorizedError(
        'User has no WRITE Permission on file',
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
 * Checks whether authenticated user has execute permission of this file
 * Used in cases:
 * 1) ???
 *
 * @param {Request} req
 * @param {Object} req.authenticatedUser : {id: <useId>} - set by a successful token authentication
 * @param {string} req.body.fileId : id of a file record
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @throw UnauthorizedError, status 401
 */
export const checkFileExecutePerm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let fileId: number = -1;
    if (req.body?.fileId) {
      fileId = parseInt(req.body?.fileId as string);
    } else if (req.query?.fileId) {
      fileId = parseInt(req.query?.fileId as string);
    }
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      select: {
        permissions: true,
      },
    });
    let canExecute = false;
    if (!file) {
      throw errorHandler.RecordNotFoundError('File does not exist');
    }
    file?.permissions.map((p: any) => {
      if (p.type == PermissionType.EXECUTE && Boolean(p.enabled) == true) {
        canExecute = true;
      }
    });
    if (!canExecute) {
      throw errorHandler.UnauthorizedError(
        'User has no EXECUTE Permission on file',
      );
    }
    next();
  } catch (error: any) {
    errorHandler.handleError(error, res);
  }
};
