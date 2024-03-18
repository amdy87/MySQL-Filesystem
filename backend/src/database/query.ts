import { PrismaClient, Role, PermissionType } from '@prisma/client';

const prisma = new PrismaClient();

// TODO: add user permissions for Directory and Files

// adding a new user
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
    console.log('User added');
    return newUser;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

// creating a directory
async function addDirectory(
  name: string,
  path: string,
  parentId: number,
  ownerId: number,
  permissions: PermissionType[],
) {
  try {
    const newDir = await prisma.directory.create({
      data: { name, path, parentId, ownerId },
    });
    const permission = await Promise.all(
      permissions.map(async (permissionType) => {
        return prisma.permission.create({
          data: {
            type: permissionType,
            directory: {
              connect: { id: newDir.id },
            },
          },
        });
      }),
    );
    console.log('New Directory created with permissions');
    console.log('directory permissions: ', permission);
    return newDir;
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
}

// creating a file
async function addFile(
  name: string,
  path: string,
  parentId: number,
  ownerId: number,
  content: string,
  permissions: PermissionType[],
) {
  try {
    const newFile = await prisma.file.create({
      data: { name, path, parentId, ownerId, content },
    });
    const permission = await Promise.all(
      permissions.map(async (permissionType) => {
        return prisma.permission.create({
          data: {
            type: permissionType,
            file: {
              connect: { id: newFile.id },
            },
          },
        });
      }),
    );
    console.log('New file created');
    console.log('file permissions: ', permission);
    return newFile;
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
}

// reading contents of a file
async function readFile(userId: number) {
  try {
    const files = await prisma.file.findMany({
      where: {
        ownerId: userId,
      },
    });
    console.log('read successfully');
    return files;
  } catch (e) {
    console.error('Error reading contents:', e);
    throw e;
  }
}

// deleting a file
async function removeFile(fileId: number) {
  try {
    const rmFile = await prisma.file.delete({
      where: { id: fileId },
    });
    console.log(`file with ID ${fileId} was deleted successgully`);
    return rmFile;
  } catch (error) {
    console.error('error removing file:', error);
    throw error;
  }
}

// deleting a directory
async function removeDirectory(directoryId: number) {
  try {
    const rmDirectory = await prisma.directory.delete({
      where: { id: directoryId },
    });
    console.log(`directory with ID ${directoryId} was deleted successgully`);
    return rmDirectory;
  } catch (error) {
    console.error('error removing directory:', error);
    throw error;
  }
}

// deleting a user
async function removeUser(userId: number) {
  try {
    const rmUser = await prisma.user.delete({
      where: { id: userId },
    });
    console.log(`User with ID ${userId} was deleted successgully`);
    return rmUser;
  } catch (error) {
    console.error('error removing user:', error);
    throw error;
  }
}

// delete everything?
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
};
