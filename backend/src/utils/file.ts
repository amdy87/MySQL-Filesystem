import { Metadata } from './metadata';

export interface DbFile {
  name: string;
  content?: string;
  metadata: Metadata;
}
