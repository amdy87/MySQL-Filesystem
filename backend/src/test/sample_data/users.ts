import { PrismaClient, Prisma } from '@prisma/client';

const userData: any[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    password: 'abcDefg5&',
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
    password: 'ABCDEFg5&',
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@prisma.io',
    password: 'abCDefG5&',
  },
  {
    name: 'Jordan',
    email: 'jordan@prisma.io',
    password: 'Ab84CdEfG5',
  },
];

export default userData;
