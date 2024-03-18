import { describe, it, expect } from '@jest/globals';
import {
  addUser,
  addDirectory,
  addFile,
  readFile,
  removeUser,
  removeFile,
  deleteAllData,
  removeDirectory,
} from '../query';
import { userData, directoryData, fileData } from '../sample';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('deleteEverything', () => {
  it('should clear database', async () => {
    const deleteData = await deleteAllData();
  });
});

describe('addUser', () => {
  it('should add a new user', async () => {
    const newUser = await addUser(
      userData[0].email,
      userData[0].name,
      userData[0].password,
      userData[0].role,
    );
    expect(newUser.name).toEqual(userData[0].name);
    expect(newUser.email).toEqual(userData[0].email);
    expect(newUser.role).toEqual(userData[0].role);
    userData[0].id = newUser.id;
    directoryData[0].id = newUser.id;
    fileData[0].id = newUser.id;
  });
});

describe('addDirectory', () => {
  it('should add a new directory for the user', async () => {
    const newDir = await addDirectory(
      directoryData[0].name,
      directoryData[0].path,
      directoryData[0].parentId,
      directoryData[0].ownerId,
      directoryData[0].permissions,
    );
    expect(newDir.name).toEqual(directoryData[0].name);
    expect(newDir.path).toEqual(directoryData[0].path);
    expect(newDir.parentId).toEqual(directoryData[0].parentId);
    expect(newDir.ownerId).toEqual(directoryData[0].ownerId);
    directoryData[0].id = newDir.id;
  });
});

describe('addDirectory2', () => {
  it('should add a new directory for the user with the same name, so should fail', async () => {
    // const newDir = await addDirectory(directoryData[0].name, directoryData[0].path, directoryData[0].parentId, directoryData[0].ownerId, directoryData[0].permissions)
    // expect(newDir.name).rejects.toThrow();
    await expect(() =>
      addDirectory(
        directoryData[0].name,
        directoryData[0].path,
        directoryData[0].parentId,
        directoryData[0].ownerId,
        directoryData[0].permissions,
      ),
    ).rejects.toThrow();
  });
});

describe('addFile', () => {
  it('should add a new file for the user', async () => {
    const newFile = await addFile(
      fileData[0].name,
      fileData[0].path,
      fileData[0].parentId,
      fileData[0].ownerId,
      fileData[0].content,
      fileData[0].permissions,
    );

    expect(newFile.name).toEqual(fileData[0].name);
    expect(newFile.path).toEqual(fileData[0].path);
    expect(newFile.parentId).toEqual(fileData[0].parentId);
    expect(newFile.ownerId).toEqual(fileData[0].ownerId);
    expect(newFile.content).toEqual(fileData[0].content);
    fileData[0].id = newFile.id;
  });
});

describe('addFile2', () => {
  it('should add a new file for the user with the same name, so should fail', async () => {
    // const newFile = await addFile(fileData[0].name, fileData[0].path, fileData[0].parentId, fileData[0].ownerId, fileData[0].content, fileData[0].permissions)
    // expect(newFile).rejects.toThrow();
    await expect(() =>
      addFile(
        fileData[0].name,
        fileData[0].path,
        fileData[0].parentId,
        fileData[0].ownerId,
        fileData[0].content,
        fileData[0].permissions,
      ),
    ).rejects.toThrow();
  });
});

describe('readFile', () => {
  it('should read file for the user', async () => {
    const fileRead = await readFile(fileData[0].ownerId);

    expect(fileRead[0].name).toEqual(fileData[0].name);
  });
});

describe('deleteFile', () => {
  it('delete a file', async () => {
    const deleteFile = await removeFile(fileData[0].id);
    expect(deleteFile.name).toEqual(fileData[0].name);
  });
});

describe('deleteDirectory', () => {
  it('delete a directory', async () => {
    const deleteDirectory = await removeDirectory(directoryData[0].id);
    expect(deleteDirectory.name).toEqual(directoryData[0].name);
  });
});

describe('deleteUser', () => {
  it('delete a user', async () => {
    const deleteUser = await removeUser(userData[0].id);
    expect(deleteUser.email).toEqual(userData[0].email);
  });
});
