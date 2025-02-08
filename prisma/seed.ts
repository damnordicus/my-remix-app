import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  await prisma.roll.deleteMany(); // Clear rolls first to avoid foreign key issues
  await prisma.filament.deleteMany(); // Clear existing data

  const materials = ["PLA", "PETG", "TPU", "NYLON", "ABS"];
  const brands = ["ESUN", "CREALITY", "HATCHBOX", "SUNLU"];
  const colors = ["BLACK", "BLUE", "WHITE", "RED", "GREEN", "ORANGE", "YELLOW", "PURPLE", "PINK"]

  for (let i = 0; i < 20; i++) {
    const stockLevel = faker.number.int({ min: 1, max: 10 }); // Random stock level
    const barcodes = Array.from({ length: stockLevel }, () => faker.string.alphanumeric(12)); // Generate barcodes

    const filament = await prisma.filament.create({
      data: {
        brand: brands[Math.floor(Math.random() * brands.length)],
        material: materials[Math.floor(Math.random() * materials.length)],
        color: colors[Math.floor(Math.random() * 9)],
        diameter: 1.75,
        stock_level: stockLevel,
        notes: faker.lorem.sentence(),
        barcode: barcodes, // Store all roll barcodes for this filament
      },
    });

    // Create a Roll entry for each barcode, linking it to the filament
    await Promise.all(
      barcodes.map((barcode) =>
        prisma.roll.create({
          data: {
            barcode: barcode,
            weight: 1000,
            price: parseFloat(faker.commerce.price({ min: 10, max: 50, dec: 2 })),
            purchase_date: faker.date.past(),
            filamentId: filament.id, // Correctly associate Roll with Filament
          },
        })
      )
    );
  }

  console.log("Seed data created!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
