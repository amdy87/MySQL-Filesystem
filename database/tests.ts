import { createUser } from './query.ts'; // Assuming the file containing the createUser function is named userFunctions.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const newUser = await createUser('test@example.com', 'Test User', 'password123');
    console.log('New user:', newUser);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();