/**
 * DbFile interface definition
 * @pakageDocumentation
 */

import { Metadata } from './metadata';

export interface DbFile {
  id: number;
  name: string;
  content?: string;
  metadata: Metadata;
  ownerId?: number;
  parentId?: number; //parent dir
}
