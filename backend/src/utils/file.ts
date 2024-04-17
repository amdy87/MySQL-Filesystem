/**
 * DbFile interface definition
 * @fileoverview
 */

import { Metadata } from './metadata';

export interface DbFile {
  id: number;
  name: string;
  path?: string;
  content?: string;
  metadata: Metadata;
  ownerId?: number;
  parentId?: number; //parent dir
}
