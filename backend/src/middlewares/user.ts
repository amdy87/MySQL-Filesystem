import { Response, Request, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Prisma, Role } from '@prisma/client';

import { prisma } from '../entrypoint';
import { errorHandler } from '../utils/errorHandler';

// Define a custom property 'user' on the Request object
declare global {
  namespace Express {
    interface Request {
      user?: any; // Change 'any' to the type of your user object if possible
    }
  }
}

/**
 *
 * Validate Whether UserId exist in database
 * userId is stored in field 'userId' of req.body
 * @throw UserNotFoundError
 */

export const userExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let user: Prisma.UserFindUniqueArgs;
    const { userId } = req.body;
    if (!userId) {
      throw errorHandler.InvalidParamError('userId');
    }
    user = { where: { id: userId } };
    const existUser = await prisma.user.findUnique(user);
    if (!existUser) {
      throw errorHandler.UserNotFoundError(
        'User does not exist, please signup',
      );
    }
    req.user = existUser;
    next();
  } catch (error: any) {
    errorHandler.handleError(error, res);
  }
};

/**
 *
 * Validate Whether UserId exist in database
 * userId is stored in req.body.params.id
 * @throw UserNotFoundError
 */

export const userExistParam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let user: Prisma.UserFindUniqueArgs;
    const userId = parseInt(req.params.id);
    user = { where: { id: userId } };
    if (!userId) {
      throw errorHandler.InvalidParamError('userId');
    }
    const existUser = await prisma.user.findUnique(user);
    if (!existUser) {
      throw errorHandler.UserNotFoundError(
        `User with id ${userId} does not exist`,
      );
    }
    req.user = existUser;
    next();
  } catch (error: any) {
    errorHandler.handleError(error, res);
  }
};

/**
 *
 * Validate Whether email exist in database
 * before autheticate user login
 * @throw UserNotFoundError
 */

export const userExistByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let user: Prisma.UserFindUniqueArgs;
    const { email } = req.body;
    user = {
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        rootDirId: true,
        password: true,
      },
    };
    if (!email) {
      throw errorHandler.InvalidParamError('email');
    }
    const existUser = await prisma.user.findUnique(user);
    if (!existUser) {
      throw errorHandler.UserNotFoundError(
        'User does not exist, please signup',
      );
    }
    req.user = existUser;
    next();
  } catch (error: any) {
    errorHandler.handleError(error, res);
  }
};

/**
 * Check administration access
 * @throw ForbiddenError
 */
export const userIsAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req;
    if (!user || user.role !== Role.ADMIN) {
      const message =
        'Current user does not have access to specified resource.';
      throw errorHandler.ForbiddenError(message);
    }
    next();
  } catch (error: any) {
    errorHandler.handleError(error, res);
  }
};