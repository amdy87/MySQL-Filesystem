/**
 * Metadata and Perms interface definition
 * @pakageDocumentation
 */

export type Metadata = {
  perms: Perms;
  createdAt: number;
  updatedAt: number;
};

export type Perms = {
  read: boolean;
  write: boolean;
  execute: boolean;
};
