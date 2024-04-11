/*
  Warnings:

  - You are about to drop the `_DirectoryPermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FilePermissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_DirectoryPermissions` DROP FOREIGN KEY `_DirectoryPermissions_A_fkey`;

-- DropForeignKey
ALTER TABLE `_DirectoryPermissions` DROP FOREIGN KEY `_DirectoryPermissions_B_fkey`;

-- DropForeignKey
ALTER TABLE `_FilePermissions` DROP FOREIGN KEY `_FilePermissions_A_fkey`;

-- DropForeignKey
ALTER TABLE `_FilePermissions` DROP FOREIGN KEY `_FilePermissions_B_fkey`;

-- DropTable
DROP TABLE `_DirectoryPermissions`;

-- DropTable
DROP TABLE `_FilePermissions`;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_directoryId_fkey` FOREIGN KEY (`directoryId`) REFERENCES `Directory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
