import { Response, Request, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../utils/config';
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
      const message = 'Access token is not set.';
      throw errorHandler.UnauthorizedError(message);
    }

    // Verify access token and extract user data
    const [_, token] = authHeader.split(' ');
    if (!(token && JWT_SECRET)) {
      const message = 'Access token is not set.';
      throw errorHandler.UnauthorizedError(message);
    }

    const payload = jwt.verify(token, JWT_SECRET as jwt.Secret);
    req.user = payload as JwtPayloadWithUser;
    next();
  } catch (error: any) {
    const message = 'Token Invalid or expired';
    errorHandler.handleError(errorHandler.UnauthorizedError(message), res);
  }
};
