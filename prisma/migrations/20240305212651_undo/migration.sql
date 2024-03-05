/*
  Warnings:

  - Added the required column `fileId` to the `FileContent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_fileContentId_fkey`;

-- AlterTable
ALTER TABLE `FileContent` ADD COLUMN `fileId` INTEGER NOT NULL;
