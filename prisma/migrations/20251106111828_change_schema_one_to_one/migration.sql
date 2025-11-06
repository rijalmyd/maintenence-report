/*
  Warnings:

  - A unique constraint covering the columns `[asset_id]` on the table `chassises` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[asset_id]` on the table `equipments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[asset_id]` on the table `vehicles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "chassises_asset_id_key" ON "chassises"("asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "equipments_asset_id_key" ON "equipments"("asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_asset_id_key" ON "vehicles"("asset_id");
