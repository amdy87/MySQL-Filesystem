/**
 * Unit Test written for Permission API
 * @packageDocumentation
 */

import { Request, Response } from 'express';

process.env.DATABASE_URL = 'default_value';

import { permissionControllers } from '../controllers/permission';
import { prisma } from '../connectPrisma';

// Mock the Prisma methods globally
// When you use jest.mock at the top level of your test file,
// Jest replaces all exports of the mocked module with mock functions,
// and Jest resets those mock functions before each test automatically.
// This means that each test will start with a fresh set of mock functions, preventing interference between tests.
jest.mock('../connectPrisma', () => ({
  prisma: {
    permission: { findMany: jest.fn() },
  },
}));

describe('get permissions', () => {
  it('should return 3 permissions', async () => {
    // Create a mock instance of PrismaClient
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = {}; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    // Mock Prisma method
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

    await permissionControllers.getPermissions(req as Request, res as Response);

    // Assert response
    expect(res.send).toHaveBeenCalledWith({
      permissions: [
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
      ],
    });
  });
});
