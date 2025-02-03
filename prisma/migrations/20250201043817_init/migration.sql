-- CreateTable
CREATE TABLE "Filament" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "diameter" DOUBLE PRECISION NOT NULL,
    "weight_grams" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "stock_level" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Filament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrintJob" (
    "id" SERIAL NOT NULL,
    "filament_id" INTEGER NOT NULL,
    "print_date" TIMESTAMP(3) NOT NULL,
    "grams_used" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "notes" TEXT,

    CONSTRAINT "PrintJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "contact_info" TEXT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FilamentToSupplier" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FilamentToSupplier_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FilamentToSupplier_B_index" ON "_FilamentToSupplier"("B");

-- AddForeignKey
ALTER TABLE "PrintJob" ADD CONSTRAINT "PrintJob_filament_id_fkey" FOREIGN KEY ("filament_id") REFERENCES "Filament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilamentToSupplier" ADD CONSTRAINT "_FilamentToSupplier_A_fkey" FOREIGN KEY ("A") REFERENCES "Filament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilamentToSupplier" ADD CONSTRAINT "_FilamentToSupplier_B_fkey" FOREIGN KEY ("B") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
