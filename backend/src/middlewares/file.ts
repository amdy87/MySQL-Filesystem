/**
 * Middleware used in File API endpoints
 * @fileoverview
 */

import { Response, Request, NextFunction } from 'express';
import { errorHandler } from '../utils/errorHandler';

/**
 * This middleware is called if token is valid
 *  (after authenticated in middleware/auth.ts/authAccessToken)
 * Checks whether authenticated user has read permission of this file
 * Used in cases:
 * 1) get file by fileId
 * 2) get file by fileId & parentId
 *
 * @param {Request} req
 *    @param {Object} req.authenticatedUser : {id: <useId>} - set by a successful token authentication
 *    @param {string} req.params.fileId : id of a file record
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @throw ForbiddenError, status code 403
 */
export const checkReadPerm = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get permissions of this file for this user
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
 * @param {string} req.params.fileId : id of a file record
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @throw ForbiddenError, status code 403
 */
export const checkWritePerm = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

/**
 * This middleware is called if token is valid
 * (after authenticated in middleware/auth.ts/authAccessToken)
 * Checks whether authenticated user has execute permission of this file
 * Used in cases:
 * 1) ???
 *
 * @param {Request} req
 * @param {Object} req.authenticatedUser : {id: <useId>} - set by a successful token authentication
 * @param {string} req.params.fileId : id of a file record
 * @param {Response} res
 * @param {NextFunction} next
 *
 * @throw ForbiddenError, status code 403
 */
export const checkExecutePerm = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
