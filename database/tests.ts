import { addUser, addDirectory, addFile } from './query.ts'; // Assuming the file containing the createUser function is named userFunctions.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const newUser = await addUser('test@example5.com', 'Test User', 'password123');
    console.log('New user:', newUser);

    // TODO: add user permission capabilities
    const newDir = await addDirectory("directory_test", "./directory_test", 0);
    console.log('New directory:', newDir);

    const newFile = await addFile("file_test", newDir.id, "./directory_test/file_test");
    console.log('New file:', newFile);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();