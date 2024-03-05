export type Metadata = {
    perms: Perms;
    createdAt: number;
    updDatedAt: number;
}

type Perms = {
    read: boolean;
    write: boolean;
    execute: boolean;
}
