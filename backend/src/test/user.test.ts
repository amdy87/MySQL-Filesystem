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

// Mock the Prisma methods globally
// When you use jest.mock at the top level of your test file,
// Jest replaces all exports of the mocked module with mock functions,
// and Jest resets those mock functions before each test automatically.
// This means that each test will start with a fresh set of mock functions, preventing interference between tests.
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

describe('User signup and login', () => {
  userData.forEach((user, index) => {
    it(`should create user ${user.name}`, async () => {
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

      await userControllers.signUp(req as Request, res as Response);

      // Assert user creation
      expect(res.status).toHaveBeenCalledWith(201);
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
