import { Request, Response } from 'express';
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
    },
    directory: {
      create: jest.fn(),
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

      // Mock Prisma user create method
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

      const response = await userControllers.signUp(
        req as Request,
        res as Response,
      );

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
