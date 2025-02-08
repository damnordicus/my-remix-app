-- CreateTable
CREATE TABLE "Roll" (
    "id" SERIAL NOT NULL,
    "barcode" TEXT NOT NULL,
    "filamentId" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "purchase_date" TIMESTAMP(3),

    CONSTRAINT "Roll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roll_barcode_key" ON "Roll"("barcode");

-- AddForeignKey
ALTER TABLE "Roll" ADD CONSTRAINT "Roll_filamentId_fkey" FOREIGN KEY ("filamentId") REFERENCES "Filament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
