// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Filament table with 100 entries
  const materials = ['PETG', 'PLA', 'TPU', 'ABS', 'NYLON'];
  const brands = ['SUNLU', 'ESUN', 'HATCHBOX', 'CREALITY'];
  const colors = ['BLACK', 'RED', 'BLUE', 'GREEN', 'ORANGE', 'YELLOW', 'PURPLE', 'GRAY', 'WHITE', 'RAINBOW'];
  for (let i = 1; i <= 50; i++) {
    await prisma.filament.create({
      data: {
        brand: brands[Math.floor(Math.random() * brands.length)].toUpperCase(),
        color: colors[Math.floor(Math.random() * colors.length)].toUpperCase(),
        weight_grams: Math.floor(Math.random() * 1000) + 100, // Random weight between 100-1100g
        material: materials[Math.floor(Math.random() * materials.length)].toUpperCase(),
        purchase_date: new Date(),
        diameter: 1.75,
        price: 0.00,
        stock_level: Math.floor(Math.random() * 100),
      },
    });
  }

  // Add more tables and data if needed
  // Example: Seed other tables like 'categories', 'suppliers', etc.
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
