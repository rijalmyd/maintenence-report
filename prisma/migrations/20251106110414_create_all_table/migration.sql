-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('VEHICLE', 'CHASSIS', 'EQUIPMENT', 'OFFICE_TOOL');

-- CreateEnum
CREATE TYPE "ChassisType" AS ENUM ('RANGKA', 'FLATBED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "fullname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" UUID NOT NULL,
    "driver_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" UUID NOT NULL,
    "asset_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "asset_type" "AssetType" NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "serrial_number" TEXT,
    "purchase_date" TIMESTAMP(3),
    "purchase_price" INTEGER,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "license_plate" TEXT,
    "color" TEXT,
    "year" INTEGER,
    "engine_number" TEXT,
    "frame_number" TEXT,
    "no_kir" TEXT,
    "kir_due_date" TIMESTAMP(3),
    "stnk_due_date" TIMESTAMP(3),
    "notes" TEXT,
    "asset_id" UUID NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chassises" (
    "id" UUID NOT NULL,
    "chassis_number" TEXT NOT NULL,
    "chassis_type" "ChassisType" NOT NULL,
    "chassis_category" TEXT NOT NULL,
    "axle_count" INTEGER NOT NULL,
    "no_kir" TEXT,
    "kir_due_date" TIMESTAMP(3),
    "notes" TEXT,
    "asset_id" UUID NOT NULL,

    CONSTRAINT "chassises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipments" (
    "id" UUID NOT NULL,
    "equipment_code" TEXT NOT NULL,
    "equipment_type" TEXT NOT NULL,
    "specification" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "asset_id" UUID NOT NULL,

    CONSTRAINT "equipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spareparts" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "stock_quantity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "spareparts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenences" (
    "id" UUID NOT NULL,
    "record_number" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "complaint" TEXT NOT NULL,
    "repair_notes" TEXT NOT NULL,
    "driver_id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "km_asset" INTEGER NOT NULL,
    "total_cost" INTEGER NOT NULL,
    "labor_cost" INTEGER NOT NULL,
    "spareparts_cost" INTEGER NOT NULL,
    "asset_image_url" TEXT NOT NULL,

    CONSTRAINT "maintenences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenence_images" (
    "id" UUID NOT NULL,
    "maintenence_id" UUID NOT NULL,
    "image_id" UUID NOT NULL,

    CONSTRAINT "maintenence_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenence_spareparts" (
    "id" UUID NOT NULL,
    "maintenence_id" UUID NOT NULL,
    "sparepart_id" UUID NOT NULL,

    CONSTRAINT "maintenence_spareparts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "maintenence_images_maintenence_id_image_id_key" ON "maintenence_images"("maintenence_id", "image_id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenence_spareparts_maintenence_id_sparepart_id_key" ON "maintenence_spareparts"("maintenence_id", "sparepart_id");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chassises" ADD CONSTRAINT "chassises_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenences" ADD CONSTRAINT "maintenences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenences" ADD CONSTRAINT "maintenences_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenences" ADD CONSTRAINT "maintenences_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenence_images" ADD CONSTRAINT "maintenence_images_maintenence_id_fkey" FOREIGN KEY ("maintenence_id") REFERENCES "maintenences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenence_images" ADD CONSTRAINT "maintenence_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenence_spareparts" ADD CONSTRAINT "maintenence_spareparts_maintenence_id_fkey" FOREIGN KEY ("maintenence_id") REFERENCES "maintenences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenence_spareparts" ADD CONSTRAINT "maintenence_spareparts_sparepart_id_fkey" FOREIGN KEY ("sparepart_id") REFERENCES "spareparts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
