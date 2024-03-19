import { Request, Response } from 'express';
import { directoryController } from '../controllers/directory';
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
  },
}));

describe('getDirectories', () => {
  it('should return directories', async () => {
    // Create a mock instance of PrismaClient
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = { body: { userId: 1 } }; // Mock request
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

    await directoryController.getDirectories(req as Request, res as Response);

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
