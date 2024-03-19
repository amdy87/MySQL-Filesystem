/*
  Warnings:

  - A unique constraint covering the columns `[name,parentId]` on the table `Directory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,parentId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Directory_name_ownerId_key` ON `Directory`;

-- DropIndex
DROP INDEX `File_name_ownerId_key` ON `File`;

-- CreateIndex
CREATE UNIQUE INDEX `Directory_name_parentId_key` ON `Directory`(`name`, `parentId`);

-- CreateIndex
CREATE UNIQUE INDEX `File_name_parentId_key` ON `File`(`name`, `parentId`);
