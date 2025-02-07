import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  await prisma.filament.deleteMany(); // Clear existing data

  for (let i = 0; i < 10; i++) {
    const stockLevel = faker.number.int({ min: 1, max: 10 }); // Random stock level
    const barcodes = Array.from({ length: stockLevel }, () => faker.string.alphanumeric(12)); // Generate barcodes
    const materials = ['PLA', 'PETG', 'TPU', 'NYLON', 'ABS'];
    const brands = ['ESUN', 'CREALITY', 'HATCHBOX', 'SUNLU'];

    await prisma.filament.create({
      data: {
        brand: brands[Math.floor(Math.random() * 4)],
        material: materials[Math.floor(Math.random() * 5)],
        color: faker.color.human().toUpperCase(),
        diameter: parseFloat(faker.number.float({ min: 1.5, max: 3.0, precision: 0.01 }).toFixed(2)),
        weight_grams: faker.number.int({ min: 500, max: 1000 }),
        price: parseFloat(faker.commerce.price({ min: 10, max: 50, dec: 2 })),
        purchase_date: faker.date.past(),
        stock_level: stockLevel,
        notes: faker.lorem.sentence(),
        barcode: barcodes, // Assign generated barcodes
      },
    });
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
