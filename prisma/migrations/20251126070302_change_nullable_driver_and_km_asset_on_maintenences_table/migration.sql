-- DropForeignKey
ALTER TABLE `maintenences` DROP FOREIGN KEY `maintenences_driver_id_fkey`;

-- DropIndex
DROP INDEX `maintenences_driver_id_fkey` ON `maintenences`;

-- AlterTable
ALTER TABLE `maintenences` MODIFY `driver_id` CHAR(36) NULL,
    MODIFY `km_asset` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `maintenences` ADD CONSTRAINT `maintenences_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
