/*
  Warnings:

  - You are about to drop the column `price` on the `Filament` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_date` on the `Filament` table. All the data in the column will be lost.
  - You are about to drop the column `weight_grams` on the `Filament` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Filament" DROP COLUMN "price",
DROP COLUMN "purchase_date",
DROP COLUMN "weight_grams";
