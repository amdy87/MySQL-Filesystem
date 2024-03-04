import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// creating a new user
async function createUser(email: string, name: string, password: string) {
    try {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password,
        },
      });
      console.log('User created:', newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  // creating a directory


  // creating a file


  
  export { createUser };