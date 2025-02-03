import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

// Prevent multiple Prisma instances in dev mode (fixes Next.js/Remix issues)
declare global {
  var __prisma: PrismaClient | undefined;
}

if (!global.__prisma) {
  global.__prisma = new PrismaClient();
}

prisma = global.__prisma;

export { prisma };
