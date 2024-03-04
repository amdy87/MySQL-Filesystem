/*
  Warnings:

  - You are about to drop the column `authorId` on the `File` table. All the data in the column will be lost.
  - Added the required column `directoryParent` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `File` DROP COLUMN `authorId`,
    ADD COLUMN `directoryParent` INTEGER NOT NULL,
    ADD COLUMN `path` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Directory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `directoryName` VARCHAR(191) NOT NULL,
    `directoryParent` INTEGER NOT NULL,
    `path` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Directory` ADD CONSTRAINT `Directory_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
