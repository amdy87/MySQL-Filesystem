/**
 * Unit Test written for User API
 * @packageDocumentation
 */

import { Request, Response } from 'express';

// Mocked env variables only need to be non-null
process.env.DATABASE_URL = 'default_value';
process.env.JWT_SECRET = 'iiiiedsfsdf';

import { userControllers } from '../controllers/user';
import { prisma } from '../connectPrisma';
import userData from './sample_data/users';
import badUserData from './sample_data/bad.user.data';
import bcrypt from 'bcrypt';

// Mock the Prisma methods globally
// When you use jest.mock at the top level of your test file,
// Jest replaces all exports of the mocked module with mock functions,
// and Jest resets those mock functions before each test automatically.
// This means that each test will start with a fresh set of mock functions, preventing interference between tests.

class CustomError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    // Ensure the correct prototype chain
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hashSync: jest.fn(),
  hash: jest.fn(),
}));

jest.mock('../connectPrisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    directory: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },

    file: {
      deleteMany: jest.fn(),
    },
    permission: {
      findMany: jest.fn(),
    },
  },
}));

describe('getUsers', () => {
  it('should return users', async () => {
    // Create a mock instance of PrismaClient
    // console.log(prisma); // Debugging: Log prisma object
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = {}; // Mock request
    res = { send: jest.fn() }; // Mock response

    // Mock Prisma method
    (prisma.user.findMany as jest.Mock).mockResolvedValueOnce([
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
    ]);

    await userControllers.getUsers(req as Request, res as Response);

    // Assert response
    expect(res.send).toHaveBeenCalledWith({
      user: [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ],
    });
  });
});

describe('User Login', () => {
  it(`should throw a 401 error`, async () => {
    const mockPassword = 'incorrectPassword';
    const hashedPassword = await bcrypt.hash('correctPassword', 10);
    const req: Partial<Request> = {
      body: {
        name: 'asb',
        email: 'asb@gmail.com',
        inputPassword: mockPassword,
      },
      authenticatedUser: {
        email: '@.com',
        rootDirId: 'here',
        password: hashedPassword,
      },
    }; // Mock request
    const res: Partial<Response> = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

    await userControllers.loginWithPassword(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('User Login', () => {
  it(`should successfully login`, async () => {
    const mockPassword = 'correctPassword22';
    const hashedPassword = await bcrypt.hash('correctPassword', 10);
    const req: Partial<Request> = {
      body: {
        password: mockPassword,
      },
      authenticatedUser: {
        id: 1,
        name: 'user1',
        role: 'USER',
        email: 'asb@gmail.com',
        password: hashedPassword,
      },
    }; // Mock request
    const res: Partial<Response> = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    await userControllers.loginWithPassword(req as Request, res as Response);
    console.log(`hello: ${res.status}`);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `user1 LOG IN successfully`,
      }),
    );
  });
});

describe('User signup and login', () => {
  userData.forEach((user, index) => {
    it(`should create user ${user.name} with index ${index} and email ${user.email}`, async () => {
      const req: Partial<Request> = {
        body: { name: user.name, email: user.email, password: user.password },
      }; // Mock request
      const res: Partial<Response> = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      }; // Mock response

      // Mock Prisma user methods
      (prisma.user.create as jest.Mock).mockResolvedValueOnce({
        id: index + 1, // Assuming user IDs start from 1
        ...user,
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: index + 1, // Assuming user IDs start from 1
        name: user.name,
      });

      (prisma.user.update as jest.Mock).mockResolvedValueOnce({
        id: index + 1, // Assuming user IDs start from 1
        name: user.name,
        rootDirId: index + 1,
      });

      // Mock Prisma user create method
      (prisma.directory.create as jest.Mock).mockResolvedValueOnce({
        id: index + 1, // Assuming dir IDs start from 1
        name: `${user.name}_root`,
        path: '.',
        ownerId: index + 1,
      });

      (prisma.permission.findMany as jest.Mock).mockResolvedValueOnce([
        { id: 1 },
        { id: 2 },
      ]);

      (bcrypt.hashSync as jest.Mock).mockResolvedValueOnce('hashedpw');

      console.log(user.email);
      await userControllers.signUp(req as Request, res as Response);
      // Assert user creation
      expect(res.status).toHaveBeenCalledWith(201);
      // expect(res.json).toHaveBeenCalledWith(
      //   expect.objectContaining({
      //     message: 'User with the same email already exists.',
      //   }),
      // );
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          user: {
            id: index + 1, // Assuming user IDs start from 1
            name: user.name,
            rootDirId: index + 1,
          },
        }),
      );
    });
  });
});

describe('User signup Fail', () => {
  badUserData.forEach((user) => {
    it(`should throw a 400 error with user ${user.name}`, async () => {
      const req: Partial<Request> = {
        body: { name: user.name, email: user.email, password: user.password },
      }; // Mock request
      const res: Partial<Response> = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      }; // Mock response
      let mockError = new CustomError('Mocked error', 'P2002');
      (prisma.user.create as jest.Mock).mockRejectedValueOnce(mockError);

      await userControllers.signUp(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});


describe('update user by id', () => {
  it('Update user name but missing userId, should return status 400', async () => {
    // Create a mock instance of PrismaClient
    // console.log(prisma); // Debugging: Log prisma object
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = { body: {} }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    await userControllers.updateUserById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('Update user name with userId, should return status 200', async () => {
    // Create a mock instance of PrismaClient
    // console.log(prisma); // Debugging: Log prisma object
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = {
      body: { userId: '1', name: 'newName' },
      authenticatedUser: { email: '@.com', rootDirId: 'here' },
    }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Mock response
    (prisma.user.update as jest.Mock).mockResolvedValueOnce({
      id: 1,
      name: 'newName',
    });

    await userControllers.updateUserById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('delete user account', () => {
  it('missing userId in query, should return status 400', async () => {
    // Create a mock instance of PrismaClient
    // console.log(prisma); // Debugging: Log prisma object
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = { query: {} }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    // Mock Prisma method
    (prisma.file.deleteMany as jest.Mock).mockResolvedValueOnce([
      { id: 1, name: 'file 1' },
      { id: 2, name: 'file 2' },
    ]);

    (prisma.directory.deleteMany as jest.Mock).mockResolvedValueOnce([
      { id: 1, name: 'dir 1' },
      { id: 2, name: 'dir 2' },
    ]);

    await userControllers.deleteUserById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return status ok', async () => {
    // Create a mock instance of PrismaClient
    // console.log(prisma); // Debugging: Log prisma object
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = { query: { userId: '1' } }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    // Mock Prisma method
    (prisma.user.delete as jest.Mock).mockResolvedValueOnce([
      { id: 1, name: 'user 1' },
    ]);
    (prisma.file.deleteMany as jest.Mock).mockResolvedValueOnce([
      { id: 1, name: 'file 1' },
      { id: 2, name: 'file 2' },
    ]);

    (prisma.directory.deleteMany as jest.Mock).mockResolvedValueOnce([
      { id: 1, name: 'dir 1' },
      { id: 2, name: 'dir 2' },
    ]);

    await userControllers.deleteUserById(req as Request, res as Response);
    // Assert response
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('user logout', () => {
  it('should return logout message', async () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = {}; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    await userControllers.userLogout(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith({
      message: 'LOG OUT successfully',
    });
  });
});
