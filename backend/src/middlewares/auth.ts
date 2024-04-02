/**
 * Middleware used in authentication
 * @pakageDocumentation
 */

import { Response, Request, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../utils/constants';
import { errorHandler } from '../utils/errorHandler';

// Interface extending JwtPayload with a 'user' property
interface JwtPayloadWithUser extends jwt.JwtPayload {
  user: any; // Adjust the type according to your user object
}

/**
 * Validate access token
 * @throw UnauthorizedError
 */
export const authAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Read auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const message = 'Access token is not set';
      throw errorHandler.UnauthorizedError(message);
    }

    // Verify access token and extract user data
    // Assume authHeader is a string with format "Bearer <token>"
    const [_, token] = authHeader.split(' ');
    if (!(token && JWT_SECRET)) {
      const message =
        'Access token is set but not in correct "Bearer <token>" format';
      throw errorHandler.UnauthorizedError(message);
    }

    const decoded = jwt.verify(token, JWT_SECRET as jwt.Secret);
    req.authenticatedUser = decoded as JwtPayloadWithUser;
    next();
  } catch (error: any) {
    console.log(error);
    error.message = error.message || 'Token Invalid or expired';
    errorHandler.handleError(error, res);
  }
};
