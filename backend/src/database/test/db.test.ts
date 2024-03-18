// import { addUser, addDirectory, addFile, readFile, removeUser } from '../query.js'; 
// import userData from '../sample.js';
// import { PrismaClient } from '@prisma/client';
// import { describe, it, expect } from '@jest/globals';

// const prisma = new PrismaClient();

// async function main() {
//   try {
//     // add a new user
//     const email = `test44@test.com`;
//     const name = "test";
//     const password = "password123";
//     const role = Role.ADMIN;
//     const newUser = await addUser(email, name, password, role);
//     console.log('New user:', newUser);

//     // add a new directory for the user
//     const directoryName = "directory3";
//     const directoryPath = "/directory";
//     const directoryParentId = 0;
//     const directoryOwnerId = 2;
//     const permissions = [PermissionType.READ, PermissionType.WRITE, PermissionType.EXECUTE]
//     const newDir = await addDirectory(directoryName, directoryPath, directoryParentId, directoryOwnerId, permissions);
//     console.log('New directory:', newDir);

//     // add a new directory with the same name for the user (should fail)
//     // const directoryName2 = "directory";
//     // const directoryPath2 = "/directory";
//     // const directoryParentId2 = 0;
//     // const directoryOwnerId2 = 1;
//     // // TODO: add user permission capabilities
//     // const newDir2 = await addDirectory(directoryName2, directoryPath2, directoryParentId2, directoryOwnerId2);
//     // console.log('New directory, same name:', newDir2);

//     // add a new file in the directory for the user
//     const fileName = "file1.txt";
//     const filePath = "/directory2/file.txt"
//     const fileParentId = 2;
//     const fileOwnerId = 2;
//     const content = "file content";
//     // TODO: add user permission capabilities
//     const newFile = await addFile(fileName, filePath, fileParentId, fileOwnerId, content);
//     console.log('New file:', newFile);

//     // read the contents of the file
//     const userId = 1;
//     const readingFile = await readFile(userId);
//     console.log("file read:", readingFile);

//     // delete the file
//     // delete the directory
//     // delete the user
//     const deleteUser = await removeUser(userId);
//     console.log("deleted user", deleteUser);

//   } catch (error) {
//     console.error('Error:', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main();