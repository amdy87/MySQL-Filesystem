import { addUser, addDirectory, addFile, readFile } from './query.ts'; 
import { PrismaClient } from '@prisma/client';
import { jest, describe, it, expect } from '@jest/globals';

const prisma = new PrismaClient()
// jest.mock('@prisma/client');
// const PrismaClientMock = PrismaClient as jest.MockedClass<typeof PrismaClient>;
// const prismaMock = new PrismaClientMock();

// describe('addUser', () => {
//   it('should add a new user', async() => {
//     prismaMock.user.create.mockResolvedValueOnce({ });
//     const newUser = await addUser();
//     expect(newUser).toEqual({});
//   });
// });

async function main() {
  try {
    // add a new user
    const email = "test3@test.com";
    const name = "test";
    const password = "password123";
    const role = "ADMIN";
    const newUser = await addUser(email, name, password, role);
    console.log('New user:', newUser);

    // add a new directory for the user
    const directoryName = "directory";
    const directoryPath = "/directory";
    const directoryParentId = 0;
    const directoryOwnerId = 1;
    // TODO: add user permission capabilities
    const newDir = await addDirectory(directoryName, directoryPath, directoryParentId, directoryOwnerId);
    console.log('New directory:', newDir);

    // add a new file in the directory for the user
    const fileName = "file.txt";
    const filePath = "/directory/file.txt"
    const fileParentId = 1;
    const fileOwnerId = 1;
    const content = "file content";
    const newFile = await addFile(fileName, filePath, fileParentId, fileOwnerId, content);
    console.log('New file:', newFile);

    // read the contents of the file
    const userId = 1;
    const readingFile = await readFile(userId);
    console.log("file read:", readingFile);

    // delete the file
    // delete the directory
    // delete the user

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();