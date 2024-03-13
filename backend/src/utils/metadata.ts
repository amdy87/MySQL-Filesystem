export type Metadata = {
  perms: Perms;
  createdAt: number;
  updatedAt: number;
};

type Perms = {
  read: boolean;
  write: boolean;
  execute: boolean;
};
