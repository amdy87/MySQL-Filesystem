-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('READ', 'WRITE', 'EXECUTE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DirectoryPermissions` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DirectoryPermissions_AB_unique`(`A`, `B`),
    INDEX `_DirectoryPermissions_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_DirectoryPermissions` ADD CONSTRAINT `_DirectoryPermissions_A_fkey` FOREIGN KEY (`A`) REFERENCES `Directory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DirectoryPermissions` ADD CONSTRAINT `_DirectoryPermissions_B_fkey` FOREIGN KEY (`B`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
