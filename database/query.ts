import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

// TODO: add user permissions for Directory and Files

// adding a new user
async function addUser(email: string, name: string, password: string) {
    try {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password,
        },
      });
      console.log('User added:', newUser);
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }
  
  // creating a directory
  async function addDirectory(directoryName: string, path: string, directoryParent: number) {
    try {
      const newDir = await prisma.directory.create({
        data: {
          directoryName,
          path,
          directoryParent,
        },
      });
      console.log('New Directory created:', newDir);
      return newDir;
    } catch (error) {
      console.error('Error creating directory:', error);
      throw error;
    }
  }

  // creating a file
  async function addFile(fileName: string, directoryParent: number, path: string) {
    try {
      const newFile = await prisma.file.create({
        data: {
          fileName,
          directoryParent,
          path,
        },
      });
      console.log('New file created:', newFile);
      return newFile;
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }
  // reading contents of a directory

  // reading contents of a file


export {addUser, addDirectory, addFile}