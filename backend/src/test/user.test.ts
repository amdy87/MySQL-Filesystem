import { Request, Response } from 'express';
import { userControllers } from '../controllers/user';
import { prisma } from '../connectPrisma';

// Mock the Prisma methods globally
jest.mock('../connectPrisma', () => ({
  prisma: {
    user: {
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
