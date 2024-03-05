import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// TODO: add user permissions for Directory and Files

// adding a new user
async function addUser(email: string, name: string, password: string, role: string) {
    try {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password,
          role,
        },
      });
      console.log('User added');
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }
  
  // creating a directory
  async function addDirectory(name: string, path: string, parentId: number, ownerId: number) {
    try {
      const newDir = await prisma.directory.create({
        data: {
          name,
          path,
          parentId,
          ownerId
        },
      });
      console.log('New Directory created');
      return newDir;
    } catch (error) {
      console.error('Error creating directory:', error);
      throw error;
    }
  }

  // creating a file
  async function addFile(name: string, path: string, parentId: number, ownerId: number, fileContentId: number) {
    try {
      const newFile = await prisma.file.create({
        data: {
          name,
          path,
          parentId,
          ownerId,
          fileContentId
        },
      });
      console.log('New file created');
      return newFile;
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }

  // reading contents of a directory
  async function addFileContent(fileId: number, content: string) {
    try {
      const newFileContent = await prisma.fileContent.create({
        data: {
          fileId,
          content,
        },
      });
      console.log('New file content created');
      return newFileContent;
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }

  // reading contents of a file

  // deleting a directory

  // deleting a file

  // deleting a user


export {addUser, addDirectory, addFile, addFileContent}