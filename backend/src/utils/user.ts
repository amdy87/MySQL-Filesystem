/**
 * User interface definition
 * @pakageDocumentation
 */

// import { $Enums } from '@prisma/client';
import { DbDirectory } from './directory';
import { DbFile } from './file';
import { Role } from './constants';

export interface User {
  name: string;
  email: string;
  id: number;
  rootDirId?: number;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date | null;
  directories?: DbDirectory[];
  files?: DbFile[];
  tokenId?: string;
}
