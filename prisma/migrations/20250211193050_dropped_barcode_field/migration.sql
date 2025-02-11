/*
  Warnings:

  - You are about to drop the column `barcode` on the `Filament` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Filament` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Filament_barcode_idx";

-- AlterTable
ALTER TABLE "Filament" DROP COLUMN "barcode",
DROP COLUMN "notes";

-- CreateIndex
CREATE INDEX "Filament_id_idx" ON "Filament"("id");
