import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

import { prisma } from '../entrypoint';
import directoryController from './directory';
import { errorHandler } from '../utils/errorHandler';

const userControllers = {
  // Create and register a User
  // Register a user
  signUp: async (req: Request, res: Response) => {
    try {
      let user: Prisma.UserCreateInput;
      const { name, email, password } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 12);
      user = {
        name: name,
        email: email,
        password: hashedPassword,
      };
      const newUser = await prisma.user.create({ data: user });
      // Create a root directory for new user
      const addRootDirRequest = Object.assign({}, req, {
        ...req,
        body: {
          name: 'root',
          path: '',
          ownerId: newUser.id,
          // Add or modify properties as needed
        },
      }) as Request;

      const newRootDir = await directoryController.addRootDirectory(
        addRootDirRequest,
        res,
      );
      if (!newRootDir) {
        throw errorHandler.ForbiddenError('Root directory creation failed');
      }
      // Create a root directory for new user
      const updateUserRequest = Object.assign({}, req, {
        ...req,
        body: {
          userId: newUser.id,
          rootDirId: newRootDir.id,
          // Add or modify properties as needed
        },
      }) as Request;
      // Update user's rootDirId field
      await userControllers.updateUserById(updateUserRequest, res);
    } catch (error: any) {
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
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          rootDirId: true,
        },
      });
      if (!user) {
        throw errorHandler.UserNotFoundError(
          'User does not exist, please signup',
        );
      }
      const userPassword: string = user?.password || '';
      const result = await bcrypt.compare(password, userPassword);
      if (result) {
        res.json({
          message: `${user?.name} LOG IN successfully`,
          user: user,
        });
      } else {
        throw errorHandler.UnauthorizedError('Incorrect password');
      }
    } catch (error: any) {
      // Set generic error message on auth errors
      if (error.code === 'P2025') {
        const message: string = 'A related User record could not be found.';
        error = errorHandler.UserNotFoundError(message);
      }

      errorHandler.handleError(error, res);
    }
  },

  // Update User information
  updateUserById: async (req: Request, res: Response) => {
    try {
      // Extract updated user data from request body
      const { name, email, userId, rootDirId } = req.body;

      if (!userId) {
        throw errorHandler.InvalidParamError('userId');
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw errorHandler.UserNotFoundError('User does not exist');
      }
      // Update user record in the database
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          id: existingUser.id,
          name: name || existingUser.name, // Update name if provided, otherwise keep existing value
          email: email || existingUser.email, // Update email if provided, otherwise keep existing value
          rootDirId: rootDirId || existingUser.rootDirId,
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
      res.status(200).send({ user: updatedUser, debugMsg: 'updated user' });
      return updatedUser;
    } catch (error: any) {
      if (error.code === 'P2025') {
        const message: string = 'A related User record could not be found.';
        error = errorHandler.UserNotFoundError(message);
      }
      errorHandler.handleError(error, res);
    }
  },

  // Delete a user with the specified id and all related data
  deleteUserById: async (req: Request, res: Response) => {
    const userId = req.params.id;
    const userIdInt = parseInt(userId, 10);
    try {
      const user = await prisma.user.delete({
        where: {
          id: userIdInt,
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
      //  TODO: Delete related directory and files
      res.status(200).send({ user: user });
    } catch (error: any) {
      console.log(error);
      if (error.code === 'P2025') {
        const message: string = 'A related User record could not be found.';
        error = errorHandler.UserNotFoundError(message);
      }
      errorHandler.handleError(error, res);
    }
  },
};

export default userControllers;
