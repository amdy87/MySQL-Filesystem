/**
 * Querys to use with database
 */

import { PrismaClient, Role, PermissionType } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Function to add a new user
 * @param email: string,
 * @param name: string,
 * @param password: string,
 * @param role: Role,
 *
 * @return created user
 */
async function addUser(
  email: string,
  name: string,
  password: string,
  role: Role,
) {
  try {
    const newUser = await prisma.user.create({
      data: { email, name, password, role },
    });
    console.log('User added', `ID: ${newUser.id}`);
    return newUser;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

/**
 *
 * @param name : string
 * @param path : string
 * @param parentId : number
 * @param ownerId : number
 * @param permissions : PermissionType[]
 *
 * @returns newDir, the new directory
 */
async function addDirectory(
  name: string,
  path: string,
  parentId: number,
  ownerId: number,
  permissions: PermissionType[],
) {
  try {
    const permissionData = permissions.map((pType) => ({
      type: pType,
      userId: ownerId,
      enabled: true,
    }));

    const newDir = await prisma.directory.create({
      data: {
        name,
        path,
        parentId,
        ownerId,
        permissions: {
          createMany: {
            data: permissionData,
          },
        },
      },
    });

    console.log('New Directory created with permissions', `id: ${newDir.id}`);
    return newDir;
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
}

/**
 *
 * @param name : string
 * @param path : string
 * @param parentId : number
 * @param ownerId : number
 * @param content : string
 * @param permissions : permission type
 * @returns newFile, the new file created
 */
async function addFile(
  name: string,
  path: string,
  parentId: number,
  ownerId: number,
  content: string,
  permissions: PermissionType[],
) {
  try {
    const permissionData = permissions.map((pType) => ({
      type: pType,
      userId: ownerId,
      enabled: true,
    }));

    const newFile = await prisma.file.create({
      data: {
        name,
        path,
        parentId,
        ownerId,
        content,
        permissions: {
          createMany: {
            data: permissionData,
          },
        },
      },
    });
    console.log('New file created', `FILE: ${newFile}`);
    return newFile;
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
}

/**
 *
 * @param userId : number
 * @returns files that match the userId
 */
async function readFile(userId: number) {
  try {
    const files = await prisma.file.findMany({
      where: {
        ownerId: userId,
      },
    });
    console.log('read successfully', files);
    return files;
  } catch (e) {
    console.error('Error reading contents:', e);
    throw e;
  }
}
/**
 *
 * @param fileId : number
 * @returns permissions for the specified file
 */
async function listPermsForFile(fileId: number) {
  try {
    const perms = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
      select: {
        permissions: true,
      },
    });
    console.log(`Permissions for file ${fileId}`, perms);
    return perms;
  } catch (e) {
    console.error('Error reading contents:', e);
    throw e;
  }
}
/**
 *
 * @param directoryId : number
 * @returns permissions for the specified directory
 */
async function listPermsForDirectory(directoryId: number) {
  try {
    const perms = await prisma.directory.findUnique({
      where: {
        id: directoryId,
      },
      select: {
        permissions: true,
      },
    });
    console.log(`Permissions for directory ${directoryId}`, perms);
    return perms;
  } catch (e) {
    console.error('Error reading contents:', e);
    throw e;
  }
}
/**
 *
 * @param userId : number
 * @returns permissions for the specified user
 */
async function listPermsForUser(userId: number) {
  try {
    const perms = await prisma.permission.findMany({
      where: {
        userId: userId,
      },
    });
    console.log(`Permissions for user ${userId}`, perms);
    return perms;
  } catch (e) {
    console.error('Error reading contents:', e);
    throw e;
  }
}

/**
 *
 * @param fileId : number
 * @returns file that was removed
 */
async function removeFile(fileId: number) {
  try {
    const rmFile = await prisma.file.delete({
      where: { id: fileId },
    });
    console.log(`file with ID ${fileId} was deleted successfully`);
    return rmFile;
  } catch (error) {
    console.error('error removing file:', error);
    throw error;
  }
}

/**
 *
 * @param directoryId : number
 * @returns directory that was deleted
 */
async function removeDirectory(directoryId: number) {
  try {
    const rmDirectory = await prisma.directory.delete({
      where: { id: directoryId },
    });
    console.log(`directory with ID ${directoryId} was deleted successfully`);
    return rmDirectory;
  } catch (error) {
    console.error('error removing directory:', error);
    throw error;
  }
}

/**
 *
 * @param userId : number
 * @returns user that was deleted
 */
async function removeUser(userId: number) {
  try {
    const rmUser = await prisma.user.delete({
      where: { id: userId },
    });
    console.log(`User with ID ${userId} was deleted successfully`);
    return rmUser;
  } catch (error) {
    console.error('error removing user:', error);
    throw error;
  }
}

/**
 * deletes everything from all tables
 */
async function deleteAllData() {
  try {
    await prisma.user.deleteMany({});
    await prisma.file.deleteMany({});
    await prisma.directory.deleteMany({});
    await prisma.permission.deleteMany({});
    console.log('all data deleted successfully');
  } catch (e) {
    console.error('error deleting everytiong', e);
    throw e;
  }
}

export {
  addUser,
  addDirectory,
  addFile,
  readFile,
  removeUser,
  removeFile,
  removeDirectory,
  deleteAllData,
  listPermsForFile,
  listPermsForDirectory,
  listPermsForUser,
};
