import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

import { prisma } from '../entrypoint';
import { directoryController } from './directory';
import { User } from '../utils/user';
import { errorHandler } from '../utils/errorHandler';

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
    const newRootDir = await directoryController.addRootDirectory(
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
      const hashedPassword = bcrypt.hashSync(password, 12);
      user = {
        name: name,
        email: email,
        password: hashedPassword,
      };
      const newUser = await prisma.user.create({ data: user });

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
      res.status(201).send({ user: updatedUser });
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
      const existUser = req.user;
      const { password, ...user } = existUser;

      const inputPassword: string = req.body.password;
      console.log(inputPassword);
      const result = await bcrypt.compare(inputPassword, password);

      if (result) {
        res.json({
          message: `${existUser?.name} LOG IN successfully`,
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

      const existingUser = req.user;

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
