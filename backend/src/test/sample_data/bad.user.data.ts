import { PrismaClient, Prisma } from '@prisma/client';

const badUserData: any[] = [
  // missing a number
  {
    name: 'Alex',
    email: 'alex@prisma.io',
    password: 'abcDefg&',
  },
  // missing a capital letter
  {
    name: 'Nathan',
    email: 'nathan@prisma.io',
    password: 'ABCDEFG5&',
  },
  // missing a lowercase letter
  {
    name: 'Matthew',
    email: 'matthew@prisma.io',
    password: 'abcdefg5&',
  },
  // less than 8 characters
  {
    name: 'Jared',
    email: 'jared@prisma.io',
    password: 'Ab84cD',
  },
];

export default badUserData;