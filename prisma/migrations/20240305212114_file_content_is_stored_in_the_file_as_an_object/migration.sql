/*
  Warnings:

  - You are about to drop the column `fileId` on the `FileContent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileContentId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `FileContent` DROP COLUMN `fileId`;

-- CreateIndex
CREATE UNIQUE INDEX `File_fileContentId_key` ON `File`(`fileContentId`);

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_fileContentId_fkey` FOREIGN KEY (`fileContentId`) REFERENCES `FileContent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
