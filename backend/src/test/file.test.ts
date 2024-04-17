/**
 * Unit Test written for File API
 * @packageDocumentation
 */

import { Request, Response } from 'express';

process.env.DATABASE_URL = 'default_value';

import { fileControllers } from '../controllers/file';
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
    file: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    permission: { findMany: jest.fn() },
  },
}));

describe('get Files By userId', () => {
  it('should return files', async () => {
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
    (prisma.file.findMany as jest.Mock).mockResolvedValueOnce([
      { ownerId: 1, name: 'file 1' },
      { ownerId: 1, name: 'file 2' },
    ]);

    await fileControllers.getFiles(req as Request, res as Response);

    // Assert response
    expect(res.send).toHaveBeenCalledWith({
      ownerId: 1,
      files: [
        { ownerId: 1, name: 'file 1' },
        { ownerId: 1, name: 'file 2' },
      ],
    });
  });
});

describe('get Files By fileId', () => {
  it('should return a file with the fileId', async () => {
    // Create a mock instance of PrismaClient
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = { query: { fileId: '1' } }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    // Mock Prisma method
    (prisma.file.findUnique as jest.Mock).mockResolvedValueOnce({
      id: '1',
      name: 'file 1',
      content: 'hi',
      createdAt: new Date(),
    });

    await fileControllers.getFileById(req as Request, res as Response);

    // Assert response
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('Get File without userId', () => {
  it('should return 400 status', async () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = {}; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    await fileControllers.getFiles(req as Request, res as Response);

    // Assert response
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('get Files By userId and parentDirId', () => {
  it('should return files', async () => {
    // Create a mock instance of PrismaClient
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = { query: { userId: '1', parentId: '1' } }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    // Mock Prisma method
    (prisma.file.findMany as jest.Mock).mockResolvedValueOnce([
      { ownerId: 1, name: 'file 1', parentId: '1' },
      { ownerId: 1, name: 'file 2', parentId: '1' },
    ]);

    await fileControllers.getFilesByParentDir(req as Request, res as Response);

    // Assert response
    expect(res.send).toHaveBeenCalledWith({
      ownerId: 1,
      files: [
        { ownerId: 1, name: 'file 1', parentId: '1' },
        { ownerId: 1, name: 'file 2', parentId: '1' },
      ],
    });
  });
});

describe('Get File without userId or parentId', () => {
  it('should return 400 status', async () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = { query: { userId: '1' } }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    await fileControllers.getFilesByParentDir(req as Request, res as Response);

    // Assert response
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('create a File, update it, and then delete', () => {
  // Mock Prisma method
  const sampleFileId = 1;
  const sampleOwnerId = 1;
  const sampleFileName = 'Jimmy';
  const sampleNewFileName = 'Jonny';
  const sampleParentDirId = 1;
  (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce([
    {
      id: `${sampleOwnerId}`,
    },
  ]);
  (prisma.permission.findMany as jest.Mock).mockResolvedValueOnce([
    'READ',
    'WRITE',
    'EXECUTE',
  ]);

  (prisma.file.findUnique as jest.Mock).mockResolvedValueOnce({
    id: `${sampleFileId}`,
    createdAt: new Date(),
  });

  (prisma.file.create as jest.Mock).mockResolvedValueOnce({
    id: `${sampleFileId}`,
    ownerId: `${sampleOwnerId}`,
    name: `${sampleFileName}`,
    path: '.',
    parentId: `${sampleParentDirId}`,
    content: 'hi',
    permissions: ['READ', 'WRITE', 'EXECUTE'],
  });

  (prisma.file.delete as jest.Mock).mockResolvedValueOnce({
    id: `${sampleFileId}`,
    name: `${sampleFileName}`,
  });

  (prisma.file.update as jest.Mock).mockResolvedValueOnce({
    id: `${sampleFileId}`,
    name: `${sampleNewFileName}`,
  });

  it('should create a file', async () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = {
      body: {
        ownerId: `${sampleFileId}`,
        name: `${sampleFileName}`,
        path: '.',
        parentId: `${sampleParentDirId}`,
        content: 'hi',
      },
    }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    await fileControllers.addFile(req as Request, res as Response);
    // Assert response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      id: `${sampleFileId}`,
      ownerId: `${sampleOwnerId}`,
      name: `${sampleFileName}`,
      path: '.',
      parentId: `${sampleParentDirId}`,
      content: 'hi',
      permissions: ['READ', 'WRITE', 'EXECUTE'],
    });
  });

  it('should update the file name', async () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    const sampleFileId = 1;
    req = {
      body: {
        fileId: `${sampleFileId}`,
        name: `${sampleNewFileName}`,
      },
    }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    await fileControllers.updateFileById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      file: {
        id: `${sampleFileId}`,
        name: `${sampleNewFileName}`,
      },
    });
  });

  it('should delete the file by fileId', async () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    const sampleFileId = 1;
    req = {
      body: {
        fileId: `${sampleFileId}`,
      },
    }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    (prisma.file.findUnique as jest.Mock).mockResolvedValueOnce({
      id: `${sampleFileId}`,
      createdAt: new Date(),
    });

    await fileControllers.deleteFileById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: `file ${sampleFileId} has been deleted`,
      file: {
        id: `${sampleFileId}`,
        name: `${sampleFileName}`,
      },
    });
  });
});

describe('Create File without required fields in req.body', () => {
  const sampleFileId = 1;
  const sampleOwnerId = 1;
  const sampleFileName = 'Jimmy';
  const sampleNewFileName = 'Jonny';
  const sampleParentDirId = 1;

  it('Missing ownerId, should return 400 status', async () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = {
      body: {
        name: `${sampleFileName}`,
        path: '.',
        parentId: `${sampleParentDirId}`,
        content: 'hi',
      },
    }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    await fileControllers.addFile(req as Request, res as Response);

    // Assert response
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('Missing name, should return 400 status', async () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = {
      body: {
        ownerId: `${sampleOwnerId}`,
        path: '.',
        parentId: `${sampleParentDirId}`,
        content: 'hi',
      },
    }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    await fileControllers.addFile(req as Request, res as Response);

    // Assert response
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('Missing parentId, should return 400 status', async () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = {
      body: {
        ownerId: `${sampleOwnerId}`,
        name: `${sampleFileName}`,
        path: '.',
        content: 'hi',
      },
    }; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    await fileControllers.addFile(req as Request, res as Response);

    // Assert response
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('Delete File without required fields in req.body', () => {
  it('Missing fileId', async () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    req = {}; // Mock request
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }; // Mock response

    await fileControllers.deleteFileById(req as Request, res as Response);

    // Assert response
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
