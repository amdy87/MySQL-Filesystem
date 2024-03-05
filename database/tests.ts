import { addUser, addDirectory, addFile } from './query.ts'; // Assuming the file containing the createUser function is named userFunctions.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const email = "test1@test.com";
    const name = "test";
    const password = "password123";
    const role = "admin";
    const newUser = await addUser(email, name, password, role);
    console.log('New user:', newUser);

    const directoryName = "directory";
    const directoryPath = "/directory";
    const directoryParentId = 0;
    const directoryOwnerId = 1;
    // TODO: add user permission capabilities
    const newDir = await addDirectory(directoryName, directoryPath, directoryParentId, directoryOwnerId);
    console.log('New directory:', newDir);

    const fileName = "file.txt";
    const filePath = "/directory/file.txt"
    const fileParentId = 1;
    const fileOwnerId = 1;
    const fileContentId = 0;
    const newFile = await addFile(fileName, filePath, fileParentId, fileOwnerId, fileContentId);
    console.log('New file:', newFile);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();