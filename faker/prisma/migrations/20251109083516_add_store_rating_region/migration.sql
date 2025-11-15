-- AlterTable
ALTER TABLE `store` ADD COLUMN `address` VARCHAR(255) NULL,
    ADD COLUMN `rating` DECIMAL(2, 1) NULL,
    ADD COLUMN `regionId` INTEGER NULL;
