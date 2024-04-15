import { describe, it, expect, vi } from 'vitest';
import { request } from '@utils/request';
import {
  getFileTree,
  sendFile,
  sendDirectory,
  fileRename,
  directoryRename,
  collectUserContent,
  deleteFile,
  deleteDirectory,
  updateFile,
} from './file';

// Mock the request module
vi.mock('@utils/request', () => ({
  request: vi.fn(),
}));

// Tests for getFileTree
describe('test getFileTree', () => {
  it('fetches file tree correctly using user and parent IDs', async () => {
    const mockData = { success: true };
    request.mockResolvedValueOnce(mockData);
    const result = await getFileTree({ userId: 'user1', parentId: 'parent1' });
    expect(request).toHaveBeenCalledWith(
      '/api/tree/treeByParent?userId=user1&parentId=parent1',
      {},
      true,
    );
    expect(result).toEqual(mockData);
  });
});

// Tests for deleteFile
describe('test deleteFile', () => {
  it('deletes a file using fileId', async () => {
    const mockData = { success: true };
    request.mockResolvedValueOnce(mockData);
    const result = await deleteFile({ fileId: '123' });
    expect(request).toHaveBeenCalledWith(
      '/api/file',
      {
        method: 'DELETE',
        body: JSON.stringify({ fileId: '123' }),
      },
      true,
    );
    expect(result).toEqual(mockData);
  });
});

// Tests for deleteDirectory
describe('test deleteDirectory', () => {
  it('deletes a directory using directoryId', async () => {
    const mockData = { success: true };
    request.mockResolvedValueOnce(mockData);
    const result = await deleteDirectory({ directoryId: '456' });
    expect(request).toHaveBeenCalledWith(
      '/api/dir',
      {
        method: 'DELETE',
        body: JSON.stringify({ directoryId: '456' }),
      },
      true,
    );
    expect(result).toEqual(mockData);
  });
});

// Tests for sendFile
describe('test sendFile', () => {
  it('sends file data to the server', async () => {
    const fileData = { name: 'testfile.txt', content: 'Hello, world!' };
    const mockData = { success: true };
    request.mockResolvedValueOnce(mockData);
    const result = await sendFile(fileData);
    expect(request).toHaveBeenCalledWith(
      '/api/file/add',
      {
        method: 'POST',
        body: JSON.stringify(fileData),
      },
      true,
    );
    expect(result).toEqual(mockData);
  });
});

// Tests for sendDirectory
describe('test sendDirectory', () => {
  it('sends directory data to the server', async () => {
    const directoryData = { name: 'newdir' };
    const mockData = { success: true };
    request.mockResolvedValueOnce(mockData);
    const result = await sendDirectory(directoryData);
    expect(request).toHaveBeenCalledWith(
      '/api/dir/add',
      {
        method: 'POST',
        body: JSON.stringify(directoryData),
      },
      true,
    );
    expect(result).toEqual(mockData);
  });
});

// Tests for fileRename
describe('test fileRename', () => {
  it('renames a file on the server', async () => {
    const renameData = { fileId: '123', newName: 'newname.txt' };
    const mockData = { success: true };
    request.mockResolvedValueOnce(mockData);
    const result = await fileRename(renameData);
    expect(request).toHaveBeenCalledWith(
      '/api/file/update',
      {
        method: 'POST',
        body: JSON.stringify(renameData),
      },
      true,
    );
    expect(result).toEqual(mockData);
  });
});

// Tests for directoryRename
describe('test directoryRename', () => {
  it('renames a directory on the server', async () => {
    const renameData = { directoryId: '456', newName: 'newdir' };
    const mockData = { success: true };
    request.mockResolvedValueOnce(mockData);
    const result = await directoryRename(renameData);
    expect(request).toHaveBeenCalledWith(
      '/api/dir/update',
      {
        method: 'POST',
        body: JSON.stringify(renameData),
      },
      true,
    );
    expect(result).toEqual(mockData);
  });
});

// Tests for collectUserContent
describe('test collectUserContent', () => {
  it('collects content for a specific user', async () => {
    const mockData = { success: true };
    request.mockResolvedValueOnce(mockData);
    const result = await collectUserContent('user2');
    expect(request).toHaveBeenCalledWith('/api/file?userId=user2', {}, true);
    expect(result).toEqual(mockData);
  });
});

// Tests for updateFile
describe('test updateFile', () => {
  it('updates file content on the server', async () => {
    const updateData = { fileId: '789', content: 'Updated content here' };
    const mockData = { success: true };
    request.mockResolvedValueOnce(mockData);
    const result = await updateFile(updateData);
    expect(request).toHaveBeenCalledWith(
      '/api/file/update',
      {
        method: 'POST',
        body: JSON.stringify(updateData),
      },
      true,
    );
    expect(result).toEqual(mockData);
  });
});
