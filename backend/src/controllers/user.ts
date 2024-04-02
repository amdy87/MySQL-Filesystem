/**
 * Controllers used in User API
 * @pakageDocumentation
 */

import { CookieOptions, Request, Response } from 'express';
import { $Enums, Prisma, PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ms from 'ms';

import { prisma } from '../connectPrisma';
import { directoryControllers } from './directory';
import { User } from '../utils/user';
import { errorHandler } from '../utils/errorHandler';
import { TOKEN } from '../utils/config';
import { Role } from '../utils/config';
import { JWT_SECRET } from '../utils/config';

/**
 * Set refresh token to cookie
 * [Not in used yet]
 * @param req: Request
 * @param res: Response
 * @param refreshToken: string
 *
 * @return void
 */
const setRefreshTokenCookie = (
  req: Request,
  res: Response,
  refreshToken: string,
) => {
  const options: CookieOptions = {
    maxAge: ms(TOKEN.Refresh.limit),
    httpOnly: true,
    signed: true,
    sameSite: 'strict',
  };
  res.cookie(TOKEN.Refresh.name, refreshToken, options as CookieOptions);
};

/**
 * Clear refresh token cookie
 * @param res: Response
 *
 * @return void
 */
const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie(TOKEN.Refresh.name);
};

/**
 * Generate access token
 * @param userId: number
 * @param name: number
 * @param userRole: Role
 *
 * @return Signed access token
 */
export const generateAccessToken = (
  userId: number,
  name: string,
  userRole: Role,
) => {
  return jwt.sign(
    { id: userId.toString(), name: name, role: userRole },
    JWT_SECRET as jwt.Secret,
    {
      expiresIn: TOKEN.Access.limit,
    },
  );
};

/**
 * Convert prisma Role enum type to ENUM Role
 * @param prismaUserRole: $Enums.Role
 *
 * @return backend ENUM `Role`
 */
const convertPrismaRole = (prismaUserRole: $Enums.Role): Role => {
  if ($Enums.Role.ADMIN === prismaUserRole) {
    return Role.ADMIN;
  } else {
    return Role.USER;
  }
};

/**
 * Verify a signed token
 * @param token
 * @return Token content
 */
// const verifyToken = (token: string) => {
//   return jwt.verify(token, JWT_SECRET as jwt.Secret);
// };

/**
 * Process new user data
 * and use is to update user
 * @param user: User
 * @param res: Response
 *
 * @return updatedUser
 *
 */
const updateUser = async (user: User, res: Response) => {
  // Update user record in the database
  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        rootDirId: user.rootDirId,
      },
      // Omit password field from the returned user object
      select: {
        id: true,
        name: true,
        email: true,
        rootDirId: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedUser;
  } catch (error: any) {
    errorHandler.handleError(error, res);
  }
};

/**
 * Create a new request for creating root directory
 * and use is to call addRootDirectory
 * @param user: User
 * @param req: Request
 * @param res: Response
 *
 * @return newRootDir
 *
 * @throws ForbiddenError
 *
 */
const createRootDir = async (user: User, req: Request, res: Response) => {
  const addRootDirRequest = Object.assign({}, req, {
    ...req,
    body: {
      name: 'root',
      path: '',
      ownerId: user.id,
    },
  }) as Request;
  try {
    const newRootDir = await directoryControllers.addRootDirectory(
      addRootDirRequest,
      res,
    );
    if (!newRootDir) {
      throw errorHandler.ForbiddenError('Root directory creation failed');
    }
    return newRootDir;
  } catch (error: any) {
    errorHandler.handleError(error, res);
  }
};

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 12);
};

export const userControllers = {
  //List of users
  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany();
      res.send({ user: users });
    } catch (error: any) {
      errorHandler.handleError(error, res);
    }
  },
  // Create and register a User
  // Register a user
  signUp: async (req: Request, res: Response) => {
    try {
      let user: Prisma.UserCreateInput;
      const { name, email, password } = req.body;

      const hashedPassword = hashPassword(password);
      user = {
        name: name,
        email: email,
        password: hashedPassword,
      };
      const newUser = await prisma.user.create({ data: user });
      // Generate new tokens
      const accessToken = generateAccessToken(
        newUser.id,
        newUser.name,
        convertPrismaRole(newUser.role),
      );
      // Create a root directory for new user
      const newRootDir = await createRootDir(
        {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
        req,
        res,
      );
      const updatedUser = await updateUser(
        {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          rootDirId: newRootDir?.id,
        },
        res,
      );

      res.status(201).send({ authToken: accessToken, user: updatedUser });
    } catch (error: any) {
      console.log(`${error}`);
      if (error.code === 'P2002') {
        const message = 'User with the same email already exists.';
        error = errorHandler.DuplicationError(message);
      }
      errorHandler.handleError(error, res);
    }
  },

  // Authenticate a user using email/password
  loginWithPassword: async (req: Request, res: Response) => {
    try {
      const existUser = req.authenticatedUser;
      const { password, ...user } = existUser;

      const inputPassword: string = req.body.password;
      const result = await bcrypt.compare(inputPassword, password);

      if (result) {
        // Generate new tokens
        const accessToken = generateAccessToken(
          existUser.id,
          existUser.name,
          existUser.role,
        );
        res.json({
          message: `${existUser?.name} LOG IN successfully`,
          authToken: accessToken,
          user: user,
        });
      } else {
        throw errorHandler.UnauthorizedError('Incorrect password');
      }
    } catch (error: any) {
      errorHandler.handleError(error, res);
    }
  },

  // Update User information
  updateUserById: async (req: Request, res: Response) => {
    try {
      // Extract updated user data from request body
      const { name, email, userId, rootDirId } = req.body;

      const existingUser = req.authenticatedUser;

      // Update user record in the database
      const updatedUser = await updateUser(
        {
          id: userId,
          name: name || existingUser.name, // Update name if provided, otherwise keep existing value
          email: email || existingUser.email, // Update email if provided, otherwise keep existing value
          rootDirId: rootDirId || existingUser.rootDirId,
        },
        res,
      );
      res.status(200).send({ user: updatedUser });
    } catch (error: any) {
      errorHandler.handleError(error, res);
    }
  },

  // Delete a user with the specified id and all related data
  // Only ADMIN user has authority to do so
  deleteUserById: async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    try {
      const user = await prisma.user.delete({
        where: {
          id: userId,
        },
        // Omit password field from the returned user object
        select: {
          id: true,
          name: true,
          email: true,
          rootDirId: true,
          role: true,
        },
      });
      //  TODO: Delete related directory and files
      res.status(200).send({ user: user });
    } catch (error: any) {
      errorHandler.handleError(error, res);
    }
  },
};
