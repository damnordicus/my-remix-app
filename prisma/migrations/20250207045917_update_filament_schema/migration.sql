/*
  Warnings:

  - The `barcode` column on the `Filament` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Filament" DROP COLUMN "barcode",
ADD COLUMN     "barcode" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Filament_barcode_idx" ON "Filament"("barcode");
