/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Permission_type_key` ON `Permission`(`type`);
