/**
 * Integration tests for database
 */

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
  listPermsForFile,
  listPermsForDirectory,
  listPermsForUser,
} from '../query';
import { userData, directoryData, fileData } from '../sample';

process.env.DATABASE_URL = process.env.CI
  ? 'mysql://root:password@mysql:3306/db?schema=public'
  : 'mysql://root:password@localhost:3306/db?schema=public';

describe('deleteEverything', () => {
  it('should clear database', async () => {
    const deleteData = await deleteAllData();
    expect(deleteData);
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
  });
});

describe('addDirectory', () => {
  it('should add a new directory for the user', async () => {
    const newDir = await addDirectory(
      directoryData[0].name,
      directoryData[0].path,
      directoryData[0].parentId,
      userData[0].id,
      directoryData[0].permissions,
    );
    expect(newDir.name).toEqual(directoryData[0].name);
    expect(newDir.path).toEqual(directoryData[0].path);
    expect(newDir.parentId).toEqual(directoryData[0].parentId);
    expect(newDir.ownerId).toEqual(userData[0].id);
    directoryData[0].id = newDir.id;
  });

  it('should add a new directory for the user with the same name, so should fail', async () => {
    await expect(() =>
      addDirectory(
        directoryData[0].name,
        directoryData[0].path,
        directoryData[0].parentId,
        userData[0].id,
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
      userData[0].id,
      fileData[0].content,
      fileData[0].permissions,
    );

    expect(newFile.name).toEqual(fileData[0].name);
    expect(newFile.path).toEqual(fileData[0].path);
    expect(newFile.parentId).toEqual(fileData[0].parentId);
    expect(newFile.ownerId).toEqual(userData[0].id);
    expect(newFile.content).toEqual(fileData[0].content);
    fileData[0].id = newFile.id;
  });

  it('should add a new file for the user with the same name, so should fail', async () => {
    await expect(() =>
      addFile(
        fileData[0].name,
        fileData[0].path,
        fileData[0].parentId,
        userData[0].id,
        fileData[0].content,
        fileData[0].permissions,
      ),
    ).rejects.toThrow();
  });
});

describe('listPerms', () => {
  it('all permissions for fileId', async () => {
    const permFile = await listPermsForFile(fileData[0].id);
    expect(permFile?.permissions.map((perm) => perm.type).sort).toEqual(
      fileData[0].permissions.sort,
    );
  });
  it('all permissions for directoryId', async () => {
    const permDir = await listPermsForDirectory(directoryData[0].id);
    expect(permDir?.permissions.map((perm) => perm.type).sort).toEqual(
      directoryData[0].permissions.sort,
    );
  });
  it('all permissions for user', async () => {
    const permUser = await listPermsForUser(userData[0].id);
    expect(permUser.map((perm) => perm.type).sort).toEqual(
      [fileData[0].permissions, directoryData[0].permissions].sort,
    );
  });
});

describe('readFile', () => {
  it('should read file for the user', async () => {
    const fileRead = await readFile(userData[0].id);
    expect(fileRead[0].name).toEqual(fileData[0].name);
    expect(fileRead[0].content).toEqual(fileData[0].content);
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
