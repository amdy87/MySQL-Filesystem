import { $Enums } from '@prisma/client';
import { DbDirectory } from './directory';
import { DbFile } from './file';

export interface User {
  name: string;
  email: string;
  id: number;
  rootDirId?: number;
  role?: $Enums.Role;
  createdAt?: Date;
  updatedAt?: Date | null;
  directories?: DbDirectory[];
  files?: DbFile[];
}
