/**
 * Type definition of a TreeNode,
 * a treeNode encapsulates the list of directorys and files
 * stored in the current directory
 */
import { Metadata } from './metadata';
import { DbFile } from './file';
import { DbDirectory } from './directory';

export interface TreeNode {
  id: number;
  ownerId: number;
  files: DbFile[];
  dirs: DbDirectory[];
}
