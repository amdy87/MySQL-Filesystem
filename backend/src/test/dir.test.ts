/**
 * Unit Test written for Directory API
 * @packageDocumentation
 */

import { Request, Response } from 'express';

process.env.DATABASE_URL = 'default_value';

import { directoryControllers } from '../controllers/directory';
import { prisma } from '../connectPrisma';

// Mock the Prisma methods globally
// When you use jest.mock at the top level of your test file,
// Jest replaces all exports of the mocked module with mock functions,
// and Jest resets those mock functions before each test automatically.
// This means that each test will start with a fresh set of mock functions, preventing interference between tests.
jest.mock('../connectPrisma', () => ({
  prisma: {
    directory: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    permission: {
      findMany: jest.fn(),
    },
  },
}));

describe('getDirectories', () => {
  it('should return directories', async () => {
    // Create a mock instance of PrismaClient
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = { query: { userId: '1' } }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    // Mock Prisma method
    (prisma.directory.findMany as jest.Mock).mockResolvedValueOnce([
      { id: 1, name: 'dir 1', ownerId: 1 },
      { id: 2, name: 'dir 2', ownerId: 1 },
    ]);

    await directoryControllers.getDirectories(req as Request, res as Response);

    // Assert response
    expect(res.send).toHaveBeenCalledWith({
      ownerId: 1,
      dirs: [
        { id: 1, name: 'dir 1', ownerId: 1 },
        { id: 2, name: 'dir 2', ownerId: 1 },
      ],
    });
  });
});

describe('add a Directory', () => {
  it('should return the new directory', async () => {
    // Create a mock instance of PrismaClient
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = {
      body: {
        ownerId: '1',
        parentId: '1',
        name: 'dir1',
        path: './dir1',
      },
    }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    // Mock Prisma method
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 1,
    });

    (prisma.directory.findMany as jest.Mock).mockResolvedValueOnce([
      { id: 1, name: 'dir 1', ownerId: 1 },
      { id: 2, name: 'dir 2', ownerId: 1 },
    ]);

    (prisma.directory.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 1,
      name: 'dir_1',
      ownerId: 1,
      parentId: 1,
      createdAt: new Date(),
    });

    (prisma.directory.create as jest.Mock).mockResolvedValueOnce({
      id: 1,
      name: 'dir 1',
      ownerId: 1,
    });

    (prisma.permission.findMany as jest.Mock).mockResolvedValueOnce([
      {
        id: 1,
        type: 'READ',
      },
      {
        id: 2,
        type: 'WRITE',
      },
      {
        id: 3,
        type: 'EXECUTE',
      },
    ]);

    await directoryControllers.addDirectory(req as Request, res as Response);

    // Assert response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Successfully create a directory',
      dir: {
        id: 1,
        name: 'dir 1',
        ownerId: 1,
      },
    });
  });
});

describe('update a Directory', () => {
  it('should return the updated directory', async () => {
    // Create a mock instance of PrismaClient
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = {
      body: {
        directoryId: '1',
        name: 'newDir',
      },
    }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    // Mock Prisma method

    (prisma.directory.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 1,
      name: 'dir_1',
      ownerId: 1,
      parentId: 1,
      createdAt: new Date(),
      hey: 'dumbass',
    });

    (prisma.directory.update as jest.Mock).mockResolvedValueOnce([
      { id: 1, name: 'newDir', ownerId: 1 },
    ]);

    (prisma.permission.findMany as jest.Mock).mockResolvedValueOnce([
      {
        id: 1,
        type: 'READ',
      },
      {
        id: 2,
        type: 'WRITE',
      },
      {
        id: 3,
        type: 'EXECUTE',
      },
    ]);

    await directoryControllers.updateDirById(req as Request, res as Response);

    // Assert response
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
