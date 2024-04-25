import { PrismaClient, Prisma } from '@prisma/client';

const badUserData: any[] = [
  // invalid password with missing a number
  {
    name: 'Alex',
    email: 'alex@prisma.io',
    password: 'abcDefg&',
  },
  // invalid password with missing a capital letter
  {
    name: 'Nathan',
    email: 'nathan@prisma.io',
    password: 'ABCDEFG5&',
  },
  // invalid password with missing a lowercase letter
  {
    name: 'Matthew',
    email: 'matthew@prisma.io',
    password: 'abcdefg5&',
  },
  // invalid password with less than 8 characters
  {
    name: 'Jared',
    email: 'jared@prisma.io',
    password: 'Ab84cD',
  },
  // invalid email with length < 5 characters
  {
    name: 'Brian',
    email: '',
    password: 'abcDefg5&',
  },
  // invalid email with nothing after '@' symbol
  {
    name: 'Brian',
    email: 'Brian@',
    password: 'abcDefg5&',
  },
  // invalid email with no '@' symbol
  {
    name: 'Carl',
    email: 'carlwisc.edu',
    password: 'abcDefg5&',
  },
  // invalid email with no '.' symbol after '@' symbol
  {
    name: 'Katt',
    email: 'Katt@wiscedu',
    password: 'abcDefg5&',
  },
  // invalid email with no characters before '@' symbol
  {
    name: 'Jack',
    email: '@wisc.edu',
    password: 'abcDefg5&',
  },
  // invalid email with no characters after '@' symbol
  {
    name: 'Ian',
    email: 'Ian@',
    password: 'abcDefg5&',
  },
];

export default badUserData;
