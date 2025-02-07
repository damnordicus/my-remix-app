/*
  Warnings:

  - You are about to drop the `PrintJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FilamentToSupplier` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `barcode` to the `Filament` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PrintJob" DROP CONSTRAINT "PrintJob_filament_id_fkey";

-- DropForeignKey
ALTER TABLE "_FilamentToSupplier" DROP CONSTRAINT "_FilamentToSupplier_A_fkey";

-- DropForeignKey
ALTER TABLE "_FilamentToSupplier" DROP CONSTRAINT "_FilamentToSupplier_B_fkey";

-- AlterTable
ALTER TABLE "Filament" ADD COLUMN     "barcode" TEXT NOT NULL,
ALTER COLUMN "stock_level" DROP NOT NULL;

-- DropTable
DROP TABLE "PrintJob";

-- DropTable
DROP TABLE "Supplier";

-- DropTable
DROP TABLE "_FilamentToSupplier";

-- CreateIndex
CREATE INDEX "Filament_barcode_idx" ON "Filament"("barcode");
