import { DbFile } from "./file";
import { Metadata } from "./metadata";

export interface DbDirectory extends DbFile {
    name: string
    metadata: Metadata;
    files: DbFile[];
    directories: DbDirectory[];
}
